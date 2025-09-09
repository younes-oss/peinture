export interface Peinture {
  id: number;
  titre: string;
  description: string;
  prix: number;
  stock: number;
  imageUrl: string;
  dateCreation: string;
  categorie: string;
  categorieLibelle: string;
  disponible: boolean;
  artiste: Artiste;
}

export interface Artiste {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite?: string;
  biographie?: string;
  pays?: string;
  ville?: string;
}

export interface Categorie {
  code: string;
  libelle: string;
  imageUrl: string;
  count: number;
}
