
# NoriOLT - Arquitetura Frontend

## 🏗️ Estrutura Sugerida (Feature-Based)

```text
src/
├── api/                # Configurações do Axios e Interceptores
├── assets/             # Imagens, Vetores e Estilos Globais
├── components/         # UI Kit compartilhado (Botoes, Inputs, Cards)
├── config/             # Configurações de Ambiente (URL, Timeouts)
├── features/           # Domínios de Negócio (Lógica + UI específica)
│   ├── onu-inventory/  # Listagem, Filtros, Busca de ONUs
│   ├── provisioning/   # Fluxos de Autorização e Modais
│   ├── olt-telemetry/  # Monitoramento de Chassis e Portas
│   └── alarms/         # Gerenciamento de Alertas em tempo real
├── hooks/              # Hooks Globais (useAuth, useSocket, useLanguage)
├── services/           # Camada de Comunicação (Data Fetching)
├── types/              # Definições de Interfaces e Tipos (Organizado por Domínio)
├── utils/              # Helpers (Formatadores de dBm, Conversores de Uptime)
└── views/              # Componentes de Página (Containers de Roteamento)
```

## 🚀 Boas Práticas

1. **Separação de Preocupações**: Componentes de UI não devem conter lógica complexa de manipulação de dados de OLT. Delegue para os `services` e `hooks`.
2. **API Interceptores**: Use o `apiClient` para injetar tokens de autorização e capturar erros 401 (logout automático).
3. **Optimistic Updates**: Ao remover ou autorizar uma ONU, atualize o estado local antes mesmo da resposta da API para uma experiência instantânea.
4. **WebSocket Integration**: Use o `SocketService` para alarmes de LOS/PowerFail para evitar sobrecarga de requisições HTTP na OLT.
5. **Type Safety**: Nunca use `any`. Utilize os modelos definidos em `types.ts` para garantir que a UI reflita fielmente o estado do hardware.
