@echo off
echo ========================================
echo   Dockerisation du Backend Peinture
echo ========================================
echo.

echo 1. Arrêt des conteneurs existants...
docker-compose down

echo.
echo 2. Construction et démarrage du backend...
docker-compose up --build -d

echo.
echo 3. Attente du démarrage des services...
timeout /t 15 /nobreak > nul

echo.
echo 4. Vérification du statut des conteneurs...
docker-compose ps

echo.
echo ========================================
echo   Backend démarré avec succès !
echo ========================================
echo.
echo Backend API:      http://localhost:8080
echo Base de données:  localhost:3307 (Docker MySQL)
echo.
echo Endpoints disponibles:
echo - http://localhost:8080/api/peintures
echo - http://localhost:8080/api/artistes
echo - http://localhost:8080/api/auth/login
echo.
echo Pour arrêter: docker-compose down
echo Pour voir les logs: docker-compose logs -f backend
echo ========================================

pause