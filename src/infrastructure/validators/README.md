# Validators

AI oluşturulan içerik için doğrulama fonksiyonları.

## validateNSFWContent

AI oluşturulan içeriğin NSFW (Not Safe For Work) içerik içerip içermediğini kontrol eder.

### Kullanım

```typescript
import { validateNSFWContent } from '@umituz/react-native-ai-fal-provider';

try {
  const result = await falProvider.subscribe(modelId, input);

  // NSFW kontrolü
  validateNSFWContent(result);

  // Güvenli içerik, kullanmaya devam et
  console.log('İçerik güvenli');
} catch (error) {
  if (error instanceof NSFWContentError) {
    console.error('NSFW içerik tespit edildi!');
    // Kullanıcıya mesaj göster
  }
}
```

### Parametreler

```typescript
function validateNSFWContent(result: Record<string, unknown>): void;
```

**Parametre:**
- `result`: FAL API yanıt objesi

**Hata:** NSFW içerik tespit edilirse `NSFWContentError` fırlatır

### Nasıl Çalışır?

FAL API bazı yanıtlarında `has_nsfw_concepts` alanını döndürür. Bu alan, içeriğin farklı NSFW kategorilerinde olup olmadığını belirten bir boolean dizisidir.

```typescript
{
  "images": [...],
  "has_nsfw_concepts": [false, false, true, false]
  // NSFW içerik tespit edildi
}
```

### Örnek Uygulama

```typescript
import { useFalGeneration } from '@umituz/react-native-ai-fal-provider';
import { validateNSFWContent, NSFWContentError } from '@umituz/react-native-ai-fal-provider';

function SafeImageGenerator() {
  const { data, error, isLoading, generate } = useFalGeneration({
    onError: (error) => {
      if (error instanceof NSFWContentError) {
        Alert.alert(
          'Uygunsuz İçerik',
          'Oluşturulan içerik uygun değil. Lütfen farklı bir prompt deneyin.'
        );
      }
    },
  });

  const handleGenerate = async (prompt: string) => {
    const result = await generate('fal-ai/flux/schnell', { prompt });

    if (result) {
      try {
        validateNSFWContent(result);
        // İçerik güvenli, göster
        displayImage(result.images[0].url);
      } catch (validationError) {
        if (validationError instanceof NSFWContentError) {
          // NSFW içerik tespit edildi
          hideImage();
          showWarning('Bu içerik gösterilemez');
        }
      }
    }
  };

  return (
    <View>
      <Button onPress={() => handleGenerate(prompt)} />
      {isLoading && <ActivityIndicator />}
    </View>
  );
}
```

### Custom Validation

```typescript
import { validateNSFWContent } from '@umituz/react-native-ai-fal-provider';

class ContentValidator {
  static validate(result: Record<string, unknown>): boolean {
    try {
      validateNSFWContent(result);
      return true;
    } catch (error) {
      if (error instanceof NSFWContentError) {
        return false;
      }
      throw error;
    }
  }
}

// Kullanım
const isValid = ContentValidator.validate(result);
if (!isValid) {
  console.log('İçerik NSFW');
}
```

### İntegrasyon

#### FalProvider ile

```typescript
import { falProvider } from '@umituz/react-native-ai-fal-provider';
import { validateNSFWContent } from '@umituz/react-native-ai-fal-provider';

const safeSubscribe = async <T>(
  model: string,
  input: Record<string, unknown>
): Promise<T> => {
  const result = await falProvider.subscribe<T>(model, input);

  // Validate
  validateNSFWContent(result);

  return result;
};

// Kullanım
try {
  const result = await safeSubscribe('fal-ai/flux/schnell', { prompt: '...' });
  console.log('Güvenli içerik:', result);
} catch (error) {
  if (error instanceof NSFWContentError) {
    console.error('NSFW içerik');
  }
}
```

#### Middleware Pattern

```typescript
import { validateNSFWContent } from '@umituz/react-native-ai-fal-provider';

const withNSFWValidation = async (
  generator: () => Promise<Record<string, unknown>>
) => {
  const result = await generator();
  validateNSFWContent(result);
  return result;
};

// Kullanım
const result = await withNSFWValidation(async () => {
  return await falProvider.subscribe('fal-ai/flux/schnell', { prompt });
});
```

## NSFWContentError

NSFW içerik tespit edildiğinde fırlatılan özel hata sınıfı.

```typescript
class NSFWContentError extends Error {
  constructor(message = 'NSFW content detected') {
    super(message);
    this.name = 'NSFWContentError';
  }
}
```

### Kullanım

```typescript
import { NSFWContentError } from '@umituz/react-native-ai-fal-provider';

try {
  validateNSFWContent(result);
} catch (error) {
  if (error instanceof NSFWContentError) {
    console.error('NSFW:', error.message);
  }
}
```

### Hata İşleme

```typescript
const handleError = (error: unknown) => {
  if (error instanceof NSFWContentError) {
    // NSFW spesifik hata yönetimi
    return {
      type: 'NSFW_CONTENT',
      message: 'İçerik uygun değil',
      retryable: false,
    };
  }
  // Diğer hatalar
  return mapFalError(error);
};
```

## Best Practices

### 1. Her Zaman Doğrulayın

```typescript
// ❌ Yanlış
const result = await falProvider.subscribe(modelId, input);
displayImage(result.images[0].url); // Doğrulama yok

// ✅ Doğru
const result = await falProvider.subscribe(modelId, input);
validateNSFWContent(result); // Doğrula
displayImage(result.images[0].url);
```

### 2. Hata Yakalama

```typescript
try {
  const result = await generate();
  validateNSFWContent(result);
  showResult(result);
} catch (error) {
  if (error instanceof NSFWContentError) {
    showNSFWWarning();
  } else {
    showGenericError();
  }
}
```

### 3. Kullanıcı Bildirimi

```typescript
const handleNSFW = () => {
  Alert.alert(
    'Uygunsuz İçerik',
    'Bu içerik politikalara uymadığı için gösterilemiyor. Lütfen farklı bir prompt deneyin.',
    [{ text: 'Tamam' }]
  );
};
```

### 4. Loglama

```typescript
try {
  validateNSFWContent(result);
} catch (error) {
  if (error instanceof NSFWContentError) {
    // Analytics'e gönder
    analytics.track('NSFW_CONTENT_DETECTED', {
      model: modelId,
      prompt: input.prompt,
    });

    // Log'a kaydet
    logger.warn('NSFW content detected', { modelId, prompt });
  }
}
```

## Notlar

- `validateNSFWContent` sadece FAL API'nin `has_nsfw_concepts` alanını döndürdüğü durumda çalışır
- Tüm modeller bu alanı döndürmez
- NSFW tespiti model-side veya FAL-side yapılabilir
- Kullanıcı deneyimini etkilememek için hataları graceful şekilde ele alın

## Daha Fazla Bilgi

- [FAL Content Policy](https://fal.ai/docs/content-policy)
- [FAL NSFW Detection](https://fal.ai/docs/nsfw)
