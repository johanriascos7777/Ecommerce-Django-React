# 🛒 ('Pensando nombre') — E-Commerce Full Stack

> **Una alternativa real a Shopify para PYMEs latinoamericanas.**  

---

## 💢 ¿Por qué existe este proyecto?


| 😰 El dolor | 🎯 El gancho |
|---|---|
| Soporte en inglés | **Tu problema queda sin resolver** |
| Shopify cobra $400/mes | **Aunque no vendas nada** |
| Dependencia de terceros | **¿Y si Shopify sube sus precios?** |
| Tickets sin respuesta | **Abriste uno hace 3 días,silencio y esa platica se perdio...** |
| Tiendas genéricas | **Tu tienda igual a mil. Nadie te recuerda** |
| Contrato eterno | **Pagas cada mes, para siempre, aunque no quieras y si te vaz pierdes el sitio** |
| Eres un número | **Con Shopify nadie te conoce. Aquí sí** |

---


## 🚀 Stack Tecnológico

### Backend
- **Django** + Django REST Framework
- **PostgreSQL** (AWS RDS en producción)
- **SimpleJWT** — Autenticación con tokens Bearer
- **Djoser** — Gestión de usuarios y emails
- **Braintree** — Pasarela de pagos (PayPal + Tarjeta)

### Frontend
- **React** + Vite
- **Redux Toolkit** — Estado global
- **Tailwind CSS** — Estilos
- **HeadlessUI** — Componentes accesibles → https://headlessui.com/
- **Braintree Web Drop-In** — Widget de pago

---

## ☁️ Servicios en Producción

| Servicio | Uso |
|---|---|
| **AWS S3** | Almacenamiento de imágenes y archivos estáticos |
| **AWS RDS** | Base de datos PostgreSQL |
| **Render** | Deploy del backend Django (conectado a GitHub) |
| **Cloudflare** | CDN, dominio y seguridad |
| **SendGrid** | Envío de emails transaccionales |
| **PayPal Developer** | Sandbox de pagos → https://developer.paypal.com/ |
| **Braintree Sandbox** | Gateway de pagos → https://sandbox.braintreegateway.com/ |

---

## ⚠️ Observaciones importantes para colaboradores

### 1. Actualización de precios
Los precios deben actualizarse **simultáneamente** en dos lugares:
```
Backend  → /server/apps/product/views.py        (Django)
Frontend → /client/src/helpers/fixedPrices.jsx  (React)
```
> Si solo cambias uno, los precios mostrados no coincidirán con los cobrados.

### 2. Deploy en Render
Render debe estar **conectado al repositorio de GitHub**.  
Cada push a `main` dispara un nuevo deploy automáticamente.

### 3. Flujo de PayPal en Braintree Sandbox

```jsx
// DESARROLLO — no requiere cuenta PayPal vinculada
paypal: { flow: 'checkout' }

// PRODUCCIÓN — requiere cuenta PayPal Business real vinculada en:
// Braintree → Settings → Processing → PayPal
paypal: { flow: 'vault' }
```

---

## 🃏 Tarjetas de prueba (Braintree Sandbox)

| Tipo | Número | CVV | Fecha |
|---|---|---|---|
| ✅ Visa (aprobada) | `4111 1111 1111 1111` | `123` | `12/25` |
| ✅ Mastercard | `5500 0000 0000 0004` | `123` | `12/25` |
| ❌ Rechazada | `4000 1111 1111 1115` | `123` | `12/25` |

---

*Hecho con ☕ y mucho debugging en Colombia 🇨🇴*