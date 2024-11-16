// pontos-de-coleta.ts
export interface PontoDeColeta {
  nome: string;
  cep: string;
  latitude: number;
  longitude: number;
  endereco: string;
  tiposLixoAceitos: string[];
}

export const pontosDeColeta: PontoDeColeta[] = [
  {
    nome: "Ponto 1",
    cep: "01000-000",
    latitude: -23.5505,
    longitude: -46.6333,
    endereco: "Av. Paulista, 1000, São Paulo - SP",
    tiposLixoAceitos: ["Pilhas", "Baterias", "Celulares"]
  },
  // Outros pontos
];
