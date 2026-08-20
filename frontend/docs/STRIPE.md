# Stripe Checkout + Webhooks (Cuisenio)

Portfolio demo: **Stripe Test Mode** upgrades `ROLE_USER` → `PREMIUM` (`SubscriptionTier.PRO`) after a successful subscription Checkout.

## Architecture

| Step | What happens |
|------|----------------|
| CTA Pricing | `POST /api/payments/create-checkout-session` (JWT) → Stripe Checkout URL |
| Pay in Stripe | Test card `4242 4242 4242 4242` |
| Webhook | `POST /api/payments/webhook` verifies `Stripe-Signature`, handles `checkout.session.completed` + `customer.subscription.deleted` |
| Success page | `POST /api/payments/confirm-session?session_id=` (JWT) → idempotent promote + **fresh JWT** with `PREMIUM` |

Backend package: `com.youcode.cuisenio.features.payment`.

## 1. Stripe Dashboard (Test)

1. Create account → toggle **Test mode**.
2. Copy **Secret key** `sk_test_…` → `STRIPE_API_KEY`.
3. (Optional) Create Product **Cuisenio Gourmet Pro** + recurring Price 4,99 € / month → `STRIPE_PRICE_ID=price_…`.  
   If empty, the API builds price data dynamically (499 cents EUR / month).

## 2. Local env (backend)

```bash
cd backend
cp .env.example .env   # or export vars in your shell / IDE
# set STRIPE_API_KEY=sk_test_...
```

`application.yaml` reads:

- `stripe.api.key`
- `stripe.webhook.secret`
- `stripe.price-id` (optional)
- `stripe.success-url` / `stripe.cancel-url`

## 3. stripe-cli (webhooks)

Install: https://stripe.com/docs/stripe-cli

```bash
stripe login
stripe listen --forward-to localhost:8080/api/payments/webhook
```

Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`, then restart Spring Boot.

Trigger manually (optional):

```bash
stripe trigger checkout.session.completed
```

(For a full E2E, prefer the real Checkout UI with a logged-in Cuisenio user.)

## 4. Frontend flow

1. `npm run dev` (Vite on `:5173`)
2. Log in as a `USER`
3. Landing → Pricing → **Débloquer le Pass PRO**
4. Complete Checkout with `4242…`
5. Land on `/payment/success` → JWT refreshed → Premium APIs unlocked

Cancel path: `/payment/cancel` → toast + redirect to `/#pricing`.

## 5. Security notes

- Webhook is **public** but **signature-verified** (`Webhook.constructEvent`).
- Checkout + confirm require JWT.
- Authorities use enum names **without** `ROLE_` prefix: `hasAuthority('PREMIUM')`.
- Fictitious upgrade `POST /v1/subscription/upgrade-premium` remains available for demos without Stripe keys.

## Test cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 9995` | Decline |

Any future expiry, any CVC, any postal code in Test mode.
