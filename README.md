# @umituz/react-native-ai-fal-provider

FAL AI provider service for React Native applications. Provides client wrapper, error handling, and React hooks.

## Installation

```bash
npm install @umituz/react-native-ai-fal-provider @fal-ai/client
```

## Usage

### Initialize the Client

```typescript
import { falClientService } from "@umituz/react-native-ai-fal-provider";

falClientService.initialize({
  apiKey: "YOUR_FAL_API_KEY",
  maxRetries: 3,
  defaultTimeoutMs: 300000,
});
```

### Using the Hook

```typescript
import { useFalGeneration } from "@umituz/react-native-ai-fal-provider";

function MyComponent() {
  const { data, error, isLoading, generate, retry } = useFalGeneration({
    timeoutMs: 120000,
    onProgress: (status) => console.log("Progress:", status),
    onError: (error) => console.log("Error:", error),
  });

  const handleGenerate = async () => {
    await generate("fal-ai/flux/dev", {
      prompt: "A beautiful sunset",
      image_size: "landscape_16_9",
    });
  };

  return (
    // Your UI
  );
}
```

### Direct Service Usage

```typescript
import { falClientService } from "@umituz/react-native-ai-fal-provider";

const result = await falClientService.subscribe("fal-ai/flux/dev", {
  prompt: "A beautiful sunset",
});
```

### Error Handling

```typescript
import { mapFalError, isFalErrorRetryable } from "@umituz/react-native-ai-fal-provider";

try {
  await falClientService.run("fal-ai/flux/dev", { prompt: "test" });
} catch (error) {
  const errorInfo = mapFalError(error);
  console.log("Error type:", errorInfo.type);
  console.log("Message key:", errorInfo.messageKey);
  console.log("Retryable:", errorInfo.retryable);
}
```

## API

### falClientService

- `initialize(config)` - Initialize the client with API key
- `subscribe(endpoint, input, options)` - Subscribe to generation job
- `run(endpoint, input)` - Run a generation job
- `submitJob(endpoint, input)` - Submit a job to queue
- `getJobStatus(endpoint, requestId)` - Get job status
- `getJobResult(endpoint, requestId)` - Get job result
- `isInitialized()` - Check if client is initialized
- `reset()` - Reset the client

### useFalGeneration Hook

- `data` - Generation result
- `error` - Error info if failed
- `isLoading` - Loading state
- `isRetryable` - Whether error is retryable
- `generate(endpoint, input)` - Start generation
- `retry()` - Retry last generation
- `reset()` - Reset state

### Error Utilities

- `mapFalError(error)` - Map error to FalErrorInfo
- `isFalErrorRetryable(error)` - Check if error is retryable
- `categorizeFalError(error)` - Get error category

## License

MIT
