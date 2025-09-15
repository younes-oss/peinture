// Modèle pour représenter une commande dans le frontend
export interface Commande {
  id: number;
  clientId: number;
  clientNom: string;
  clientPrenom: string;
  articles: CommandeItem[];
  total: number;
  statut: StatutCommande;
  dateCommande: string;
  dateLivraison?: string;
  adresseLivraison: string;
  commentaire?: string;
}

// Modèle pour un article dans une commande
export interface CommandeItem {
  peintureId: number;
  peintureTitre: string;
  imageUrl: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal: number;
}

// Statuts possibles d'une commande
export type StatutCommande = 'EN_COURS' | 'EXPEDIEE' | 'LIVREE' | 'ANNULEE';

// Interface pour créer une nouvelle commande
export interface CreerCommandeRequest {
  adresseLivraison: string;
  commentaire?: string;
}

// Interface pour le statut avec label français
export interface StatutInfo {
  code: StatutCommande;
  label: string;
  color: string;
  bgColor: string;
}