import { ChatMessage } from '../../types';

export interface ChatResponse {
  content: string;
  suggestedQuestions?: string[];
  referenceData?: {
    type: 'crop' | 'weather' | 'plot';
    label: string;
  };
}

export class ChatService {
  private static knowledgeBase: Array<{
    keywords: string[];
    response: ChatResponse;
  }> = [
    {
      keywords: ['cartucho', 'lagarta', 'spodoptera', 'praga'],
      response: {
        content: `**Manejo Integrado da Lagarta-do-Cartucho (*Spodoptera frugiperda*) em Milho:**

1. **Amostragem e Nível de Ação:** 
   No Planalto Central (Huambo/Bié), recomenda-se intervir quando 5% a 8% das plantas apresentarem folhas raspadas (estágio inicial antes da entrada no cartucho).
2. **Controlo Biológico Recomendado:** 
   Aplicação de *Bacillus thuringiensis* (Bt) ou vírus de poliedrose nuclear (*SfNPV*) nas primeiras horas da manhã ou ao final da tarde.
3. **Manejo Químico Seletivo:** 
   Se o limiar crítico for ultrapassado, priorizar inseticidas fisiológicos (reguladores de crescimento de insetos - lufenuron ou novaluron) com boa cobertura dentro do cartucho.
4. **Alerta Específico:** 
   Na Fazenda Vale do Cavaco (Parcela Norte A1), as armadilhas indicam infestação inicial de 6%. Recomenda-se tratamento focalizado nas bordaduras.`,
        suggestedQuestions: [
          'Qual a dosagem recomendada de Bacillus thuringiensis?',
          'Como o clima afeta a proliferação da lagarta?',
          'Quais produtos biológicos estão registados em Angola?',
        ],
        referenceData: {
          type: 'crop',
          label: 'Milho Híbrido — Huambo',
        },
      },
    },
    {
      keywords: ['rega', 'irrigação', 'batata', 'huíla', 'chibia', 'água'],
      response: {
        content: `**Regime de Irrigação para Batata Rena no Vale da Chibia (Huíla):**

1. **Fase Fenológica Atual:**
   A cultura está em fase de tuberização e enchimento de tubérculos, período de máxima sensibilidade ao deficit hídrico.
2. **Lâmina de Água Recomendada:**
   - Evapotranspiração diária estimada (ETo): **4,2 mm/dia**.
   - Coeficiente de cultura (Kc): **1,05 a 1,15**.
   - Necessidade líquida diária: **4,4 a 4,8 mm/dia** (aprox. 45 a 48 m³/ha/dia).
3. **Estratégia de Manejo:**
   - Dividir a rega por gota-a-gota em 2 pulsos diários (manhã cedo e fim de tarde) para evitar picos de temperatura do solo.
   - Manter a tensão matricial do solo entre -25 e -35 kPa a 20 cm de profundidade.
4. **Economia Hídrica:**
   A monitorização por sensores na Sociedade Agrícola do Lubango indica humidade de 52%, o que está dentro da faixa de conforto hídrico.`,
        suggestedQuestions: [
          'Como calcular a uniformidade de emissão no gota-a-gota?',
          'Qual a humidade ideal de solo para colheita da batata?',
          'Previsão de precipitação para Chibia esta semana',
        ],
        referenceData: {
          type: 'plot',
          label: 'Parcela Planalto 1 — Chibia',
        },
      },
    },
    {
      keywords: ['ndvi', 'satélite', 'vigor', 'queda', 'índice', 'b1', 'b2'],
      response: {
        content: `**Diagnóstico Espectral e Queda de NDVI:**

1. **Interpretação dos Dados de Satélite Sentinel-2:**
   - O NDVI da Parcela Sul B1 (Vale do Cavaco) desceu de **0.78 para 0.64** na última passagem orbital (24 de Outubro).
   - O índice EVI (Enhanced Vegetation Index) confirma menor densidade de biomassa fotossinteticamente ativa no quadrante sudoeste.
2. **Cruzamento de Dados com Sensores de Solo:**
   - A humidade volumétrica a 20 cm registou queda para **33%**, abaixo do ponto crítico de capacidade de campo (38%).
3. **Plano de Ação Recomendado:**
   - Realizar teste de vazão e uniformidade de pressão nos aspersores do sector B1.
   - Inspecionar filtros de entrada e possíveis entupimentos de bicos.
   - Aplicar rega compensatória noturna de 15 mm antes da adubação de cobertura.`,
        suggestedQuestions: [
          'Quando será a próxima passagem do Sentinel-2?',
          'Como diferenciar stress hídrico de deficiência nutricional pelo NDVI?',
          'Ver observações de satélite das outras parcelas',
        ],
        referenceData: {
          type: 'plot',
          label: 'Índice Espectral Sentinel-2',
        },
      },
    },
    {
      keywords: ['adubação', 'adubo', 'ureia', 'npk', 'fertilização', 'soja', 'milho'],
      response: {
        content: `**Recomendações de Nutrição e Fertilização de Cobertura:**

1. **Para Milho (Estágio V4 - V6):**
   - **Dose:** 120 a 150 kg/ha de Ureia (46% N) ou 200 kg/ha de Sulfato de Amónio.
   - **Momento:** Sincronizar a aplicação 12 a 24 horas antes de evento de chuva leve (> 5 mm) para incorporar o azoto e minimizar perdas por volatilização de amoníaco.
2. **Para Soja (Planalto Central de Angola):**
   - Evitar adubação azotada massiva em cobertura para não inibir a nodulação natural por *Bradyrhizobium japonicum*.
   - Recomenda-se reforço foliar de Cobalto (Co) e Molibdénio (Mo) em estágio V3/V4, além de Boro e Zinco.
3. **Condições Climáticas:**
   - A previsão meteorológica indica aguaceiros benéficos para Caála na quinta-feira, tornando a quarta-feira ideal para distribuição.`,
        suggestedQuestions: [
          'Qual a diferença entre ureia protegida e convencional?',
          'Como corrigir acidez em solos ferralíticos com calcário?',
          'Calendário de fertilização para safra 2026/2027',
        ],
        referenceData: {
          type: 'crop',
          label: 'Recomendação Nutricional',
        },
      },
    },
    {
      keywords: ['mandioca', 'café', 'malanje', 'capanda', 'kwanza'],
      response: {
        content: `**Manejo Agroindustrial em Malanje (Pólo de Capanda):**

1. **Mandioca de Alta Produtividade:**
   - Monitorar a drenagem nos solos argilosos vermelhos. Com chuvas acumuladas acima de 160 mm em outubro, o risco de podridão radicular aumenta em solos compactados.
2. **Café Robusta:**
   - As condições térmicas e pluviométricas de Cacuso estão favoráveis à fase vegetativa pré-floração.
   - Recomenda-se a limpeza das ruas e desponte dos ramos ladrões para melhorar a ventilação e a incidência solar no estrato produtivo.
3. **Atenção:** 
   Alerta crítico ativo na Parcela Kwanza B devido ao encharcamento. Priorize a drenagem antes de qualquer aplicação de adubo.`,
        suggestedQuestions: [
          'Quais as variedades de mandioca mais resistentes à bacteriose em Angola?',
          'Como calibrar o carretel enrolador no Kwanza?',
          'Previsão de precipitação para Malanje',
        ],
        referenceData: {
          type: 'crop',
          label: 'Agro-Pecuária Capanda Verde',
        },
      },
    },
  ];

  static async generateReply(userPrompt: string): Promise<ChatResponse> {
    // Simulate thinking delay for natural conversational feel
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = userPrompt.toLowerCase();

    for (const item of this.knowledgeBase) {
      if (item.keywords.some((kw) => lower.includes(kw))) {
        return item.response;
      }
    }

    // Default intelligent agronomic response
    return {
      content: `Obrigado pela sua questão agronómica sobre **"${userPrompt}"**.

Com base nos dados agroclimáticos e geoespaciais das províncias de Huambo, Huíla e Malanje:

1. **Avaliação Técnica:**
   A gestão de culturas na presente época agrícola requer sincronização estrita com a humidade do solo e o ciclo de chuvas do Planalto Central e do Vale da Chibia.
2. **Boas Práticas de Manejo:**
   - Mantenha a rotação de culturas para quebrar ciclos de pragas e preservar o teor de matéria orgânica no solo.
   - Acompanhe as leituras de NDVI via Sentinel-2 para detetar anomalias de vigor vegetativo antes do aparecimento de sintomas visuais na folhagem.
   - Utilize a irrigação suplementar apenas quando a humidade de solo a 20 cm for inferior a 40% da capacidade de campo.

*Deseja analisar os dados climáticos específicos ou o histórico de satélite de alguma das suas explorações?*`,
      suggestedQuestions: [
        'Como controlar a lagarta-do-cartucho no milho em Huambo?',
        'Qual o regime de rega ideal para a batata na Huíla?',
        'Recomendação de adubação de cobertura para soja',
        'Como interpretar a queda de NDVI na Parcela Sul B1?',
      ],
      referenceData: {
        type: 'crop',
        label: 'Agronomia de Precisão — Angola',
      },
    };
  }
}
