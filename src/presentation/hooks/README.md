# React Hooks

FAL AI işlemleri için React Hook'ları.

## useFalGeneration

AI içerik oluşturma işlemleri için React hook'u.

### Parametreler

```typescript
interface UseFalGenerationOptions {
  timeoutMs?: number;                    // Zaman aşımı (ms)
  onProgress?: (status: FalQueueStatus) => void;  // İlerleme callback
  onError?: (error: FalErrorInfo) => void;        // Hata callback
}
```

### Dönüş Değeri

```typescript
interface UseFalGenerationResult<T> {
  data: T | null;                         // Oluşturulan veri
  error: FalErrorInfo | null;             // Hata bilgisi
  isLoading: boolean;                     // Yükleme durumu
  isRetryable: boolean;                   // Retry edilebilir mi?
  requestId: string | null;               // İstek ID'si
  isCancelling: boolean;                  // İptal ediliyor mu?

  generate: (modelEndpoint: string, input: FalJobInput) => Promise<T | null>;
  retry: () => Promise<T | null>;
  cancel: () => void;
  reset: () => void;
}
```

### Temel Kullanım

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';

function ImageGenerator() {
  const { data, error, isLoading, generate, retry, cancel } = useFalGeneration({
    timeoutMs: 120000,
    onProgress: (status) => {
      console.log('Durum:', status.status);
      console.log('Sıra:', status.queuePosition);
    },
    onError: (error) => {
      console.error('Hata:', error.messageKey);
    },
  });

  const handleGenerate = async () => {
    await generate('fal-ai/flux/schnell', {
      prompt: 'Güneş batımında sahil kenarında yürüyen iki kişi',
      image_size: 'landscape_16_9',
    });
  };

  return (
    <View>
      <Button onPress={handleGenerate} disabled={isLoading} />
      {isLoading && (
        <>
          <ActivityIndicator />
          <Button title="İptal" onPress={cancel} />
        </>
      )}
      {error && (
        <>
          <Text>Hata: {error.messageKey}</Text>
          {error.retryable && <Button title="Tekrar Dene" onPress={retry} />}
        </>
      )}
      {data?.images?.[0]?.url && (
        <Image source={{ uri: data.images[0].url }} />
      )}
    </View>
  );
}
```

### Video Oluşturma

```typescript
function VideoGenerator() {
  const { data, isLoading, generate } = useFalGeneration({
    timeoutMs: 300000, // 5 dakika
    onProgress: (status) => {
      console.log(`İlerleme: ${status.status}`);
      if (status.queuePosition) {
        console.log(`Sırada: ${status.queuePosition}`);
      }
    },
  });

  const handleGenerate = async () => {
    await generate('fal-ai/minimax-video', {
      prompt: 'Yağmurlu bir Tokyo sokakta yürüyen insanlar',
      aspect_ratio: '16:9',
    });
  };

  return (
    <View>
      <Button onPress={handleGenerate} disabled={isLoading} />
      {isLoading && <ActivityIndicator />}
      {data?.video?.url && <Video source={{ uri: data.video.url }} />}
    </View>
  );
}
```

### İptal Edilebilir İşlem

```typescript
function CancellableGeneration() {
  const { data, isLoading, isCancelling, generate, cancel, reset } = useFalGeneration();

  const handleGenerate = async () => {
    await generate('fal-ai/flux/dev', {
      prompt: 'Profesyonel bir iş ortamı',
    });
  };

  return (
    <View>
      <Button onPress={handleGenerate} disabled={isLoading} />
      {isLoading && !isCancelling && (
        <Button title="İptal Et" onPress={cancel} color="red" />
      )}
      {isCancelling && <Text>İptal ediliyor...</Text>}
      <Button title="Sıfırla" onPress={reset} />
      {data && <Image source={{ uri: data.images[0].url }} />}
    </View>
  );
}
```

### İlerleme Göstergesi

```typescript
function ProgressIndicator() {
  const { isLoading, generate } = useFalGeneration({
    onProgress: (status) => {
      switch (status.status) {
        case 'IN_QUEUE':
          console.log(`Sırada: ${status.queuePosition ?? 'bilinmiyor'}`);
          break;
        case 'IN_PROGRESS':
          console.log('İşleniyor...');
          break;
        case 'COMPLETED':
          console.log('Tamamlandı!');
          break;
      }

      // Logları göster
      status.logs?.forEach((log) => {
        console.log(`[${log.level}] ${log.message}`);
      });
    },
  });

  return (
    <View>
      <Button onPress={() => generate(...)} />
      {isLoading && <ActivityIndicator />}
    </View>
  );
}
```

## useModels

Model seçimi ve yönetimi için React hook'u.

### Parametreler

```typescript
interface UseModelsProps {
  readonly type: ModelType;              // Model tipi
  readonly config?: ModelSelectionConfig; // Opsiyonel yapılandırma
}

interface ModelSelectionConfig {
  readonly initialModelId?: string;      // Başlangıç modeli
  readonly defaultModelId?: string;      // Varsayılan model ID
  readonly defaultCreditCost?: number;   // Varsayılan kredi maliyeti
}
```

### Dönüş Değeri

```typescript
interface UseModelsReturn {
  models: FalModelConfig[];              // Mevcut modeller
  selectedModel: FalModelConfig | null;  // Seçili model
  selectModel: (id: string) => void;     // Model seçme fonksiyonu
  creditCost: number;                    // Seçili modelin maliyeti
  modelId: string;                       // Seçili modelin ID'si
  isLoading: boolean;                    // Yükleme durumu
  error: string | null;                  // Hata mesajı
  refreshModels: () => void;             // Modelleri yenile
}
```

### Model Seçimi

```typescript
function ModelSelector() {
  const {
    models,
    selectedModel,
    selectModel,
    creditCost,
    modelId,
    isLoading,
  } = useModels({
    type: 'text-to-image',
    config: {
      defaultCreditCost: 2,
      defaultModelId: 'fal-ai/flux/schnell',
      initialModelId: 'fal-ai/flux/dev',
    },
  });

  if (isLoading) return <ActivityIndicator />;

  return (
    <View>
      <Text>Model Seçin:</Text>
      <Picker selectedValue={modelId} onValueChange={selectModel}>
        {models.map((model) => (
          <Picker.Item
            key={model.id}
            label={`${model.name} (${model.pricing?.freeUserCost} kredi)`}
            value={model.id}
          />
        ))}
      </Picker>

      <Text>Seçili: {selectedModel?.name}</Text>
      <Text>Maliyet: {creditCost} kredi</Text>
      <Text>{selectedModel?.description}</Text>
    </View>
  );
}
```

### Model Karşılaştırma

```typescript
function ModelComparison() {
  const { models, selectModel, modelId } = useModels({
    type: 'text-to-video',
  });

  return (
    <View>
      <Text>Modelleri Karşılaştırın:</Text>
      {models.map((model) => (
        <TouchableOpacity
          key={model.id}
          onPress={() => selectModel(model.id)}
          style={[
            styles.modelCard,
            model.id === modelId && styles.selected,
          ]}
        >
          <Text style={styles.name}>{model.name}</Text>
          <Text style={styles.cost}>
            Ücretsiz: {model.pricing?.freeUserCost} kredi
          </Text>
          <Text style={styles.cost}>
            Premium: {model.pricing?.premiumUserCost} kredi
          </Text>
          <Text style={styles.description}>{model.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

## Birlikte Kullanım

### useFalGeneration + useModels

```typescript
function AIImageGenerator() {
  // Model seçimi
  const {
    models,
    selectedModel,
    selectModel,
    creditCost,
    modelId,
  } = useModels({
    type: 'text-to-image',
    config: {
      defaultCreditCost: 2,
      initialModelId: 'fal-ai/flux/schnell',
    },
  });

  // Görsel oluşturma
  const { data, error, isLoading, generate, retry } = useFalGeneration({
    onError: (error) => {
      Alert.alert('Hata', error.messageKey);
    },
  });

  const handleGenerate = async (prompt: string) => {
    await generate(modelId, {
      prompt,
      image_size: 'landscape_16_9',
    });
  };

  return (
    <View>
      {/* Model Seçimi */}
      <Text>Model: {selectedModel?.name}</Text>
      <Text>Maliyet: {creditCost} kredi</Text>

      <Picker selectedValue={modelId} onValueChange={selectModel}>
        {models.map((model) => (
          <Picker.Item
            key={model.id}
            label={`${model.name} - ${model.pricing?.freeUserCost} kredi`}
            value={model.id}
          />
        ))}
      </Picker>

      {/* Prompt Girişi */}
      <TextInput
        placeholder="Görsel açıklaması girin..."
        onChangeText={setPrompt}
      />

      {/* Oluştur Butonu */}
      <Button
        title="Oluştur"
        onPress={() => handleGenerate(prompt)}
        disabled={isLoading || !prompt}
      />

      {/* Sonuç */}
      {isLoading && <ActivityIndicator />}
      {error && error.retryable && (
        <Button title="Tekrar Dene" onPress={retry} />
      )}
      {data?.images?.[0]?.url && (
        <Image source={{ uri: data.images[0].url }} style={{ width: '100%', height: 300 }} />
      )}
    </View>
  );
}
```

## Örnek Uygulama

### Tam Özellikli AI Oluşturucu

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Image,
  Picker,
  Alert,
} from 'react-native';
import { useFalGeneration, useModels } from '@umituz/react-native-ai-fal-provider';

function AIGenerator() {
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState('landscape_16_9');

  const {
    models,
    selectedModel,
    selectModel,
    creditCost,
    modelId,
  } = useModels({
    type: 'text-to-image',
    config: {
      defaultCreditCost: 2,
      initialModelId: 'fal-ai/flux/schnell',
    },
  });

  const {
    data,
    error,
    isLoading,
    isRetryable,
    generate,
    retry,
    cancel,
    reset,
  } = useFalGeneration({
    timeoutMs: 120000,
    onProgress: (status) => {
      console.log('Durum:', status.status);
      if (status.queuePosition) {
        console.log('Sırada:', status.queuePosition);
      }
    },
    onError: (error) => {
      Alert.alert('Hata', error.messageKey);
    },
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir prompt girin');
      return;
    }

    await generate(modelId, {
      prompt: prompt.trim(),
      image_size: imageSize,
      num_inference_steps: 4,
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        AI Görsel Oluşturucu
      </Text>

      {/* Model Seçimi */}
      <View style={{ marginBottom: 20 }}>
        <Text>Model Seçin:</Text>
        <Picker
          selectedValue={modelId}
          onValueChange={selectModel}
          enabled={!isLoading}
        >
          {models.map((model) => (
            <Picker.Item
              key={model.id}
              label={`${model.name} (${model.pricing?.freeUserCost} kredi)`}
              value={model.id}
            />
          ))}
        </Picker>
        <Text>Seçili: {selectedModel?.name}</Text>
        <Text>Maliyet: {creditCost} kredi</Text>
      </View>

      {/* Image Size Seçimi */}
      <View style={{ marginBottom: 20 }}>
        <Text>Boyut:</Text>
        <Picker
          selectedValue={imageSize}
          onValueChange={setImageSize}
          enabled={!isLoading}
        >
          <Picker.Item label="Kare (1:1)" value="square_hd" />
          <Picker.Item label="Yatay (16:9)" value="landscape_16_9" />
          <Picker.Item label="Dikey (9:16)" value="portrait_9_16" />
        </Picker>
      </View>

      {/* Prompt Girişi */}
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          minHeight: 100,
        }}
        placeholder="Oluşturmak istediğiniz görseli açıklayın..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
        editable={!isLoading}
        maxLength: 1000
      />

      {/* Butonlar */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Button
            title="Oluştur"
            onPress={handleGenerate}
            disabled={isLoading || !prompt.trim()}
          />
        </View>
        {isLoading && (
          <View style={{ flex: 1 }}>
            <Button title="İptal" onPress={cancel} color="red" />
          </View>
        )}
        {error && isRetryable && (
          <View style={{ flex: 1 }}>
            <Button title="Tekrar Dene" onPress={retry} color="orange" />
          </View>
        )}
        {data && (
          <View style={{ flex: 1 }}>
            <Button title="Sıfırla" onPress={reset} color="gray" />
          </View>
        )}
      </View>

      {/* Durum */}
      {isLoading && (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 10 }}>
            Görsel oluşturuluyor...
          </Text>
        </View>
      )}

      {/* Sonuç */}
      {data?.images?.[0]?.url && (
        <View>
          <Text style={{ marginBottom: 10 }}>Sonuç:</Text>
          <Image
            source={{ uri: data.images[0].url }}
            style={{ width: '100%', height: 300, borderRadius: 8 }}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
}
```

## İpuçları

### 1. Prompt Doğrulama

```typescript
const isValidPrompt = (prompt: string) => {
  return prompt.trim().length >= 10 && prompt.trim().length <= 1000;
};
```

### 2. Debounced Generate

```typescript
import { debounce } from '@umituz/react-native-ai-fal-provider';

const debouncedGenerate = debounce(
  (prompt) => generate(modelId, { prompt }),
  1000
);
```

### 3. Kredi Bakiyesi Kontrolü

```typescript
const handleGenerate = async () => {
  const userCredits = await getUserCredits();

  if (userCredits < creditCost) {
    Alert.alert(
      'Yetersiz Bakiye',
      `Bu işlem ${creditCost} kredi gerektirir. Sizin bakiyeniz: ${userCredits}`
    );
    return;
  }

  await generate(modelId, { prompt });
};
```

### 4. Multiple Generations

```typescript
const [generatedImages, setGeneratedImages] = useState<string[]>([]);

const handleGenerate = async () => {
  const result = await generate(modelId, { prompt });

  if (result?.images) {
    setGeneratedImages(prev => [
      ...prev,
      ...result.images.map((img: any) => img.url)
    ]);
  }
};
```

## TypeScript Desteği

```typescript
import type {
  UseFalGenerationOptions,
  UseFalGenerationResult,
  UseModelsProps,
  UseModelsReturn,
} from '@umituz/react-native-ai-fal-provider';

// Tip tanımları
interface ImageGenerationResult {
  images: Array<{ url: string }>;
}

const { data } = useFalGeneration<ImageGenerationResult>({
  timeoutMs: 120000,
});

// data artık ImageGenerationResult tipinde
```

## Daha Fazla Bilgi

- [React Hooks Documentation](https://react.dev/reference/react)
- [FAL AI Documentation](https://fal.ai/docs)
