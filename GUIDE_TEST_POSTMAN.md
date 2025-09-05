# 🎨 Guide de test Postman - API Peinture

## 📋 Prérequis

1. **Démarrer le backend Spring Boot** :
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Vérifier que MySQL est démarré** avec les paramètres :
   - Host: `localhost:3306`
   - Database: `magazin`
   - Username: `root`
   - Password: `admin`

3. **Importer la collection Postman** :
   - Ouvrir Postman
   - Cliquer sur "Import"
   - Sélectionner le fichier `postman_collection.json`

## 🚀 Étapes de test

### **Étape 1 : Inscription d'un artiste**

1. **Endpoint** : `POST http://localhost:8080/api/auth/register`
2. **Headers** :
   ```
   Content-Type: application/json
   ```
3. **Body** :
   ```json
   {
       "email": "artiste@example.com",
       "password": "password123",
       "nom": "Dupont",
       "prenom": "Jean",
       "role": "ARTISTE"
   }
   ```
4. **Réponse attendue** : Un token JWT

### **Étape 2 : Connexion de l'artiste**

1. **Endpoint** : `POST http://localhost:8080/api/auth/login`
2. **Headers** :
   ```
   Content-Type: application/json
   ```
3. **Body** :
   ```json
   {
       "email": "artiste@example.com",
       "password": "password123"
   }
   ```
4. **Réponse attendue** : Un token JWT
5. **Action** : Copier le token et le coller dans la variable `jwt_token` de la collection

### **Étape 3 : Création d'une peinture**

1. **Endpoint** : `POST http://localhost:8080/api/peintures`
2. **Headers** :
   ```
   Content-Type: application/json
   Authorization: Bearer VOTRE_TOKEN_JWT_ICI
   ```
3. **Body** :
   ```json
   {
       "titre": "La Nuit Étoilée",
       "description": "Une peinture représentant un ciel nocturne avec des étoiles brillantes",
       "prix": 1500.00,
       "stock": 1,
       "imageUrl": "https://example.com/nuit-etoilee.jpg",
       "categorie": "PAYSAGE",
       "disponible": true
   }
   ```
4. **Réponse attendue** : La peinture créée avec un ID

### **Étape 4 : Lister les peintures**

1. **Endpoint** : `GET http://localhost:8080/api/peintures`
2. **Headers** : Aucun
3. **Réponse attendue** : Liste de toutes les peintures

## 🔍 Tests de sécurité

### **Test 1 : Créer une peinture sans token**
- Supprimer le header `Authorization`
- **Résultat attendu** : `401 Unauthorized`

### **Test 2 : Créer une peinture avec un client**
1. Créer un compte client
2. Se connecter avec le client
3. Essayer de créer une peinture
- **Résultat attendu** : `403 Forbidden`

### **Test 3 : Lister les peintures sans authentification**
- **Résultat attendu** : `200 OK` (endpoint public)

## 📝 Exemples de données de test

### **Inscription d'un client**
```json
{
    "email": "client@example.com",
    "password": "password123",
    "nom": "Martin",
    "prenom": "Marie",
    "role": "CLIENT"
}
```

### **Création d'un portrait**
```json
{
    "titre": "Portrait de Femme",
    "description": "Un portrait élégant d'une femme mystérieuse",
    "prix": 800.00,
    "stock": 1,
    "imageUrl": "https://example.com/portrait-femme.jpg",
    "categorie": "PORTRAIT",
    "disponible": true
}
```

### **Création d'une peinture abstraite**
```json
{
    "titre": "Composition Abstraite",
    "description": "Une œuvre abstraite aux couleurs vives",
    "prix": 1200.00,
    "stock": 1,
    "imageUrl": "https://example.com/composition-abstraite.jpg",
    "categorie": "ABSTRAIT",
    "disponible": true
}
```

## ⚠️ Points d'attention

1. **Base de données** : Assurez-vous que MySQL est démarré
2. **Port** : Vérifiez que le port 8080 est libre
3. **Token JWT** : Le token expire après 24h (86400000ms)
4. **Rôles** : Seuls les artistes peuvent créer des peintures
5. **Validation** : Les champs email et password sont obligatoires

## 🐛 Dépannage

### **Erreur 500 - Base de données**
- Vérifier que MySQL est démarré
- Vérifier les paramètres de connexion dans `application.properties`

### **Erreur 401 - Token invalide**
- Vérifier que le token est bien copié
- Vérifier le format : `Bearer TOKEN`
- Se reconnecter pour obtenir un nouveau token

### **Erreur 403 - Accès interdit**
- Vérifier que l'utilisateur a le rôle `ARTISTE`
- Se connecter avec un compte artiste

### **Erreur 400 - Données invalides**
- Vérifier le format JSON
- Vérifier que tous les champs obligatoires sont présents
