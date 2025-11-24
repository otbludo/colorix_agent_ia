# Architecture Colorix Frontend

## 🏗️ Structure du projet

Le projet a été réorganisé pour une meilleure maintenabilité et préparation aux intégrations backend :

```
src/
├── components/     # Composants réutilisables
├── pages/         # Pages de l'application
├── services/      # Services API organisés par domaine
├── hooks/         # Hooks React personnalisés
├── types/         # Types TypeScript centralisés
├── utils/         # Utilitaires et constantes
└── assets/        # Images et ressources statiques
```

## 🔧 Services API (`/services`)

### `api.ts`
Configuration centralisée de tous les appels API avec :
- Gestion automatique des tokens d'authentification
- Gestion d'erreurs unifiée
- Timeout et retry configurables
- Types de réponses standardisés

```typescript
// Utilisation
import { userService, customerService } from '@/services'

const users = await userService.getUsers({ page: 1, limit: 10 })
const customer = await customerService.createCustomer(customerData)
```

## 🎣 Hooks personnalisés (`/hooks`)

### `useAuth`
Gestion complète de l'authentification :
```typescript
const { login, logout, user, isAuthenticated } = useAuth()
```

### `useData`
Gestion des données avec pagination :
```typescript
const { data, loading, pagination, setPage } = useData(apiFunction)
```

## 📝 Types TypeScript (`/types`)

Tous les types centralisés dans `index.ts` :
- Interfaces pour les entités (User, Customer, Quote, etc.)
- Types pour les formulaires
- Types pour les réponses API
- Types utilitaires

## 🛠️ Utilitaires (`/utils`)

### `formatters.ts`
Fonctions de formatage réutilisables :
```typescript
import { formatCurrency, formatDate, timeAgo } from '@/utils'

formatCurrency(1250.50) // "1 250,50 €"
formatDate('2024-12-15') // "15 déc. 2024"
timeAgo('2024-12-14') // "il y a 1 jour"
```

### `constants.ts`
Constantes de l'application :
```typescript
import { ROUTES, USER_ROLES, API_CONFIG } from '@/utils'
```

### `mockData.ts`
Données mockées pour le développement.

## 🚀 Intégration Backend

### 1. Configuration API
Modifier `VITE_API_URL` dans les variables d'environnement.

### 2. Authentification
Le hook `useAuth` gère automatiquement :
- Stockage du token JWT
- Rafraîchissement automatique
- Gestion des erreurs

### 3. Appels API
Tous les services sont prêts pour l'intégration :
- Gestion d'erreurs standardisée
- Pagination automatique
- Types TypeScript complets

### 4. Migration des données
Remplacer les données mockées par des appels API :
```typescript
// Avant (mock)
const customers = mockCustomers

// Après (API)
const { data: customers } = await customerService.getCustomers()
```

## 📋 Checklist d'intégration

- [ ] Configurer l'URL de l'API backend
- [ ] Implémenter l'authentification JWT
- [ ] Remplacer les données mockées par des appels API
- [ ] Configurer la gestion d'erreurs globale
- [ ] Tester tous les endpoints
- [ ] Implémenter le refresh token
- [ ] Configurer les interceptors axios/fetch

## 🔒 Sécurité

- Tokens JWT stockés de manière sécurisée
- Validation côté client des formulaires
- Gestion d'erreurs sans fuite d'informations sensibles
- Protection CSRF prête à implémenter

## 📈 Performance

- Lazy loading des composants
- Optimisation des re-renders React
- Cache des données fréquemment utilisées
- Compression des assets

Cette architecture permet une intégration backend fluide et maintenable.
