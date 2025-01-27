
# Recursos-Turísticos-Cabo-Verde

Este repositorio contiene una solución que permite a los usuarios visualizar un mapa de recursos turísticos y rutas en Cabo Verde. La aplicación proporciona información detallada sobre cada recurso y ruta, facilitando la exploración y planificación de visitas turísticas. La solución está desarrollada utilizando Node.js y se despliega fácilmente tanto en un entorno local como en un contenedor Docker.

## Estructura del repositorio:

## Ejecución en local :computer:

### Prerrequisitos

Asegúrate de tener instalados previamente los siguientes componentes:

- [Node.js](https://nodejs.org/en/download/prebuilt-installer/) v.22
- [Docker](https://www.docker.com/products/docker-desktop/)

A continuación, se muestra el despliegue tanto en local como en un contenedor Docker

### Despliegue en local :house:

1. **Clonar el repositorio**
   
   Primero, clona el repositorio y situate en el directorio clonado:
   ```bash
   git clone https://github.com/MottumData/Recursos-turisticos-cabo-verde
   ```

2. **Instalación de dependencias**
    ```bash
    npm install
    ```
3. **Ejecutar UI en local (develop)**
    ```bash
    npm run dev
    ```
4. **Ejecutar UI en local (production)**
    ```bash
    npm run start
    ```

### Despliegue con Docker :whale:

1. **Clonar el repositorio**
   
   Primero, clona el repositorio y situate en el directorio clonado:
   ```bash
   git clone https://github.com/MottumData/Recursos-turisticos-cabo-verde
   ```
2. **Crear imagen de Docker**
    ```bash
    docker build -t Recursos-turisticos-cabo-verde .
    ```
3. **Ejecutar contenedor Docker**
    
    ```bash
    docker run -p 3000:3000 Recursos-turisticos-cabo-verde
    ```
