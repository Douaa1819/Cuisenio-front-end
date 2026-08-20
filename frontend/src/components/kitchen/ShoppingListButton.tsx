import { ShoppingBasket, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useShoppingListStore } from "../../store/shopping-list.store"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"

export function ShoppingListButton() {
  const { t } = useTranslation()
  const { items, toggle, remove, clearChecked, clearAll } = useShoppingListStore()
  const pending = items.filter((i) => !i.checked).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="relative rounded-lg p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          aria-label={pending ? t("shop.ariaCount", { count: pending }) : t("shop.aria")}
        >
          <ShoppingBasket className="h-5 w-5" />
          {pending > 0 && (
            <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
              {pending}
            </span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("shop.title")}</DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("shop.empty")}
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-3 rounded-xl border border-border px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggle(item.id)}
                  className="mt-1 accent-primary"
                  aria-label={t("shop.checkItem", { name: item.name })}
                />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${item.checked ? "text-muted-foreground line-through" : ""}`}>
                    {item.name}
                    {(item.quantity || item.unit) && (
                      <span className="ms-1 font-normal text-muted-foreground">
                        — {[item.quantity, item.unit].filter(Boolean).join(" ")}
                      </span>
                    )}
                  </p>
                  {item.recipeTitle && (
                    <p className="truncate text-xs text-muted-foreground">{item.recipeTitle}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label={t("shop.removeItem", { name: item.name })}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        {items.length > 0 && (
          <div className="mt-4 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={clearChecked}>
              {t("shop.clearChecked")}
            </Button>
            <Button type="button" variant="outline" className="flex-1" onClick={clearAll}>
              {t("shop.clearAll")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
