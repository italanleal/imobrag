import type { StoredDocument } from '../../modules/documents/documents.model.js';

// Textos fictícios usados somente na demonstração inicial.
export const demoDocuments: StoredDocument[] = [
  {
    "id": "locacao",
    "title": "Guia de locação",
    "topic": "Locação",
    "page": 2,
    "text": "Para iniciar a análise de locação, reúna documento de identificação, comprovante de renda e comprovante de residência. A equipe deve confirmar a modalidade de garantia e conferir a documentação antes de encaminhar a proposta.",
    "keywords": [
      "alugar",
      "locacao",
      "documentos",
      "documentacao",
      "renda",
      "garantia"
    ],
    "demo": true,
    "imported": false,
    "createdAt": "2026-11-03T00:00:00.000Z"
  },
  {
    "id": "manutencao",
    "title": "Manual de manutenção",
    "topic": "Manutenção",
    "page": 4,
    "text": "Para registrar uma solicitação de manutenção, informe uma descrição do problema e anexe fotos. A equipe responsável deve avaliar a origem do problema antes de definir o encaminhamento. Este manual não determina quem paga cada reparo.",
    "keywords": [
      "manutencao",
      "reparo",
      "vazamento",
      "conserto",
      "problema"
    ],
    "demo": true,
    "imported": false,
    "createdAt": "2026-11-03T00:00:00.000Z"
  },
  {
    "id": "vistoria",
    "title": "Roteiro de vistoria",
    "topic": "Vistorias",
    "page": 3,
    "text": "Na vistoria, registre o estado de cada ambiente com fotos e observações. Compare os registros com o laudo inicial e encaminhe eventuais divergências para a equipe responsável analisar.",
    "keywords": [
      "vistoria",
      "vistorias",
      "laudo",
      "divergencia"
    ],
    "demo": true,
    "imported": false,
    "createdAt": "2026-11-03T00:00:00.000Z"
  },
  {
    "id": "desocupacao",
    "title": "Procedimento de desocupação",
    "topic": "Desocupação",
    "page": 2,
    "text": "Para iniciar a desocupação, formalize a solicitação à imobiliária. A equipe deve consultar o contrato, orientar sobre a vistoria de saída e registrar a entrega das chaves. Este procedimento não estabelece prazos de aviso nem valores de multa.",
    "keywords": [
      "desocupacao",
      "desocupar",
      "sair",
      "chaves",
      "encerrar",
      "devolver"
    ],
    "demo": true,
    "imported": false,
    "createdAt": "2026-11-03T00:00:00.000Z"
  }
];
