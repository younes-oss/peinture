# Structure Recommandée pour le Frontend Angular

## Organisation des Dossiers

```
frontend/src/app/
├── components/           # Composants réutilisables
│   ├── shared/          # Composants partagés
│   │   ├── header/
│   │   ├── sidebar/
│   │   └── footer/
│   ├── peinture/        # Composants spécifiques aux peintures
│   │   ├── peinture-card/      # Carte réutilisable
│   │   ├── peinture-filter/    # Filtres réutilisables
│   │   └── peinture-gallery/   # Galerie réutilisable
│   ├── panier/          # Composants du panier
│   │   ├── panier-item/        # Un élément du panier
│   │   └── panier-summary/     # Résumé réutilisable
│   └── commande/        # Composants des commandes
│       ├── commande-item/      # Un élément de commande
│       └── commande-status/    # Statut réutilisable
│
├── pages/               # Pages principales (routes)
│   ├── home/           # Page d'accueil
│   ├── peintures/      # Page catalogue peintures
│   ├── artistes/       # Page liste artistes
│   ├── panier/         # Page panier complet
│   ├── commandes/      # Page historique commandes
│   └── admin/          # Page administration
```

## Recommandations pour chaque dossier :

### 1. **components/**
- Un dossier par fonctionnalité métier
- Chaque composant dans son propre dossier
- Structure : `component-name/component-name.component.ts/html/css/spec.ts`

### 2. **pages/**
- Pages principales correspondant aux routes
- Chaque page peut contenir plusieurs composants
- Structure similaire aux composants

### 3. **services/**
- Un service par entité métier
- Services partagés pour l'authentification, HTTP, etc.
- Injection de dépendances centralisée

### 4. **models/**
- Interfaces TypeScript pour typer les données
- Types personnalisés et enums
- Export centralisé des types

### 5. **guards/**
- Protection des routes
- Vérification des permissions
- Redirection automatique

### 6. **interceptors/**
- Modification des requêtes HTTP
- Gestion des tokens d'authentification
- Logging des requêtes

## Avantages de cette structure :

✅ **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités
✅ **Maintenabilité** : Code bien organisé et facile à trouver
✅ **Réutilisabilité** : Composants et services réutilisables
✅ **Testabilité** : Structure claire pour les tests
✅ **Performance** : Lazy loading possible par module
✅ **Équipe** : Facile pour plusieurs développeurs

## Prochaines étapes :

1. Créer cette structure de dossiers
2. Déplacer les fichiers existants
3. Créer les composants de base
4. Implémenter la sidebar
5. Configurer le routing

Voulez-vous que je vous aide à créer cette structure ? 