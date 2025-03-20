
import React, { useState, useRef, useEffect } from "react"
import { Search, X, Filter, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  onFilterClick?: () => void
  className?: string
  value?: string
  onChange?: (value: string) => void
  showFilterButton?: boolean
  autoFocus?: boolean
  variant?: "default" | "minimal" | "pill"
  size?: "sm" | "md" | "lg"
  suggestions?: string[]
  recentSearches?: string[]
  clearable?: boolean
  onClear?: () => void
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      placeholder = "Rechercher...",
      onSearch,
      onFilterClick,
      className,
      value,
      onChange,
      showFilterButton = false,
      autoFocus = false,
      variant = "default",
      size = "md",
      suggestions = [],
      recentSearches = [],
      clearable = true,
      onClear,
      ...props
    },
    ref,
  ) => {
    const [query, setQuery] = useState(value || "")
    const [isFocused, setIsFocused] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement) => {
      if (typeof ref === "function") {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      inputRef.current = node
    }

    useEffect(() => {
      if (value !== undefined) {
        setQuery(value)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setQuery(newValue)
      onChange?.(newValue)

      if (newValue.length > 0) {
        setShowSuggestions(true)
      } else {
        setShowSuggestions(false)
      }
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSearch?.(query)
      setShowSuggestions(false)
      inputRef.current?.blur()
    }

    const handleClear = () => {
      setQuery("")
      onChange?.("")
      onClear?.()
      inputRef.current?.focus()
    }

    const handleSuggestionClick = (suggestion: string) => {
      setQuery(suggestion)
      onChange?.(suggestion)
      onSearch?.(suggestion)
      setShowSuggestions(false)
    }

    const filteredSuggestions = query
      ? [...suggestions.filter((s) => s.toLowerCase().includes(query.toLowerCase()))]
      : []

    return (
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={cn(
              "relative flex items-center w-full",
              {
                "rounded-lg border border-gray-300 bg-white": variant === "default",
                "rounded-lg bg-gray-100 border-transparent": variant === "minimal",
                "rounded-full border border-gray-300 bg-white": variant === "pill",
                "h-8 text-xs": size === "sm",
                "h-10 text-sm": size === "md",
                "h-12 text-base": size === "lg",
              },
              isFocused && "ring-2 ring-rose-500/20 border-rose-500",
              className,
            )}
          >
            <div className="absolute left-3 flex items-center pointer-events-none">
              <Search
                className={cn(
                  "text-gray-400",
                  size === "sm" && "h-3.5 w-3.5",
                  size === "md" && "h-4 w-4",
                  size === "lg" && "h-5 w-5",
                )}
              />
            </div>

            <input
              ref={combinedRef}
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false)
                // Delay hiding suggestions to allow for clicks
                setTimeout(() => setShowSuggestions(false), 200)
              }}
              placeholder={placeholder}
              className={cn(
                "flex-1 bg-transparent outline-none",
                variant === "default" && "border-0",
                variant === "minimal" && "border-0",
                variant === "pill" && "border-0",
                size === "sm" && "pl-8 pr-8 py-1 text-xs",
                size === "md" && "pl-9 pr-9 py-2 text-sm",
                size === "lg" && "pl-10 pr-10 py-3 text-base",
                showFilterButton && "pr-20",
              )}
              autoFocus={autoFocus}
              {...props}
            />

            {clearable && query && (
              <button
                type="button"
                onClick={handleClear}
                className={cn(
                  "absolute flex items-center justify-center rounded-full hover:bg-gray-100",
                  size === "sm" && "right-2 h-5 w-5",
                  size === "md" && "right-3 h-6 w-6",
                  size === "lg" && "right-3 h-7 w-7",
                  showFilterButton && "right-12",
                )}
              >
                <X
                  className={cn(
                    "text-gray-400 hover:text-gray-600",
                    size === "sm" && "h-3 w-3",
                    size === "md" && "h-3.5 w-3.5",
                    size === "lg" && "h-4 w-4",
                  )}
                />
              </button>
            )}

            {showFilterButton && (
              <button
                type="button"
                onClick={onFilterClick}
                className={cn(
                  "absolute right-1 flex items-center justify-center rounded-md hover:bg-gray-100",
                  size === "sm" && "h-6 px-1.5",
                  size === "md" && "h-8 px-2",
                  size === "lg" && "h-10 px-3",
                )}
              >
                <Filter
                  className={cn(
                    "text-gray-500",
                    size === "sm" && "h-3.5 w-3.5",
                    size === "md" && "h-4 w-4",
                    size === "lg" && "h-5 w-5",
                  )}
                />
                <span className="ml-1 text-gray-600 text-sm">Filtres</span>
              </button>
            )}
          </div>
        </form>

        <AnimatePresence>
          {showSuggestions && (filteredSuggestions.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
            >
              {recentSearches.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500">Recherches récentes</div>
                  <div className="mt-1">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <button
                        key={`recent-${index}`}
                        className="flex w-full items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleSuggestionClick(search)}
                      >
                        <Search className="mr-2 h-3.5 w-3.5 text-gray-400" />
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredSuggestions.length > 0 && (
                <div className={cn("p-2", recentSearches.length > 0 && "border-t border-gray-100")}>
                  {recentSearches.length > 0 && (
                    <div className="px-3 py-1 text-xs font-medium text-gray-500">Suggestions</div>
                  )}
                  <div className="mt-1">
                    {filteredSuggestions.slice(0, 8).map((suggestion, index) => (
                      <button
                        key={`suggestion-${index}`}
                        className="flex w-full items-center justify-between px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <div className="flex items-center">
                          <Search className="mr-2 h-3.5 w-3.5 text-gray-400" />
                          {suggestion}
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  },
)
SearchBar.displayName = "SearchBar"

export { SearchBar }

