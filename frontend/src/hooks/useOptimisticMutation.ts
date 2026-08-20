import { useCallback } from "react"

interface OptimisticMutationOptions<TSnapshot, TResult = void> {
  applyOptimistic: () => TSnapshot
  mutation: () => Promise<TResult>
  rollback: (snapshot: TSnapshot) => void
  onSuccess?: (result: TResult) => void
  onError?: (error: unknown, retry: () => Promise<TResult>) => void
}

export function useOptimisticMutation() {
  const run = useCallback(async <TSnapshot, TResult = void>(
    options: OptimisticMutationOptions<TSnapshot, TResult>,
  ): Promise<TResult> => {
    const snapshot = options.applyOptimistic()

    const execute = async (): Promise<TResult> => {
      try {
        const result = await options.mutation()
        options.onSuccess?.(result)
        return result
      } catch (error) {
        options.rollback(snapshot)
        options.onError?.(error, execute)
        throw error
      }
    }

    return execute()
  }, [])

  return { runOptimisticMutation: run }
}
