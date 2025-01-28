export interface Card {
  [key: string]: string | number | readonly string[] | undefined
  id: number;
  titulo: string;
  status: "toDo" | "doing" | "done" | "prevented";
  tempo_estimado?: number; // Tornar opcional
  tempo: number | undefined; // Tornar compatível
  assigned: string;
  sprint: number;
  projeto: number;
  dod: string;
  dor: string;
  xp_frontend: number;
  xp_backend: number;
  xp_negocios: number;
  xp_arquitetura: number;
  xp_design: number;
  xp_datalytics: number;
  indicacao_conteudo: string;
  data_criacao: string;
}
export interface UserData {
  id: string;
  name: string;
  profileImageUrl: string;
}
export interface paramsGraphsProps {
  AllCards: Card[];
  usersData: UserData[];
  showLegend: boolean | undefined;
}
