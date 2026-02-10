
**AI-агент с базой знаний, клиентским React-приложением и сервером на FastAPI**



## Описание проекта

Этот репозиторий содержит AI-агент с базой знаний, включающий:
- **Клиентское React-приложение** (папка `Client`)
- **Сервер на FastAPI** (папка `Server`) с реализацией агента на **LangChain/LangGraph** и **RAG** на базе **LlamaIndex**
- **Локальный мониторинг** с помощью **Langfuse**
- **Docker-инфраструктуру** для быстрого развертывания


## Возможности

✅ **AI-агент** на базе LangChain/LangGraph
✅ **RAG (Retrieval-Augmented Generation)** с LlamaIndex
✅ **База знаний** на PostgreSQL
✅ **Мониторинг и аналитика** через Langfuse
✅ **Docker-контейнеризация** для легкого развертывания
✅ **Поддержка GPU** для Ollama

---

## Требования

- Docker и Docker Compose
- NVIDIA Container Toolkit (для GPU)
- Node.js (для разработки клиента)

---

## Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com:skorogod/literature-assistant.git
   cd literature-assistant
   ```

2. **Создайте `.env` файл на основе `.env.example`**

3. **Запустите проект:**
   ```bash
   docker-compose up --build
   ```

4. **Откройте в браузере:**
   - Клиент: [http://localhost:5173](http://localhost:5173)
   - Langfuse: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:8000](http://localhost:8000)

---

## Скриншоты

### Клиентская часть
![Client Screenshot](.github/images/client-screenshot.png)

### Метрики Langfuse
#### home
![Langfuse Home](.github/images/home-screenshot.png)

#### traces
![Langfuse Traces](.github/images/traces-screenshot.png)

#### trace
![Langfuse Trace](.github/images/trace-screenshot.png)

#### latency
![Langfuse Trace](.github/images/latency-screenshot.png)

#### usage management
![Langfuse Trace](.github/images/usage-screenshot.png)

---

## Конфигурация

- **PostgreSQL**: Хранит базу знаний и данные Langfuse
- **Redis**: Кэш и очереди для Langfuse
- **ClickHouse**: Аналитика и метрики
- **MinIO**: Хранение медиафайлов
- **Ollama**: Локальное развертывание LLM

---

## Разработка

### Клиент
```bash
cd Client
npm install
npm run dev
```

### Сервер
```bash
cd Server
pip install -r requirements.txt
uvicorn app.main:app --reload
```