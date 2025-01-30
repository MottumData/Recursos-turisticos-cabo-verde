
# Recursos-Turísticos-Cabo-Verde

Este repositorio contiene una solución que permite a los usuarios visualizar e interactuar con un mapa de recursos turísticos y rutas en Cabo Verde. La aplicación proporciona información detallada sobre cada recurso y ruta, permitiendo tanto filtrarlos como desplegar la informacióon relacionada a la ruta o al recurso, facilitando la exploración y planificación de visitas turísticas. Es una solución multi-idiomas, y se pueden visualizar tanto los recursos como las rutas en portugués, inglés y español. La solución está desarrollada utilizando Node.js y se despliega fácilmente tanto en un entorno local como en un contenedor Docker.

Este repositorio ha sido creado por Mottum en colaboración con Codexca

## Estructura del repositorio:

- `public/`: Archivos estáticos públicos, como imágenes y datos CSV.
  - `locale/`: Archivos de traducciones para soportar múltiples idiomas. Terminados en: pt/en/es -> (Portugués, Inglés, Español)
  - `data/`: Archivos csv con la información de rutas y recursos. Terminados en: pt/en/es -> (Portugués, Inglés, Español)

- `src/`: Código fuente de la aplicación.
  - `components/`: Componentes React utilizados en la aplicación. En la raíz de esta carpeta se encuentra mapa.tsx uno de los componentes centrales de la solución.
    - `Expanders/`: Esta carpeta contiene los componentes que usan los expanders, estos son los desplegables que se abren para eneseñar la información de rutas y recursos.
    - `Icon/`: Contiene iconUtils.tsx el cual se utiliza para crear iconos personalizados para un mapa utilizando la biblioteca Leaflet y React.
    - `Sidebar/`: Contiene los componentes que se utilizan en el sidebar y el sidebar.tsx que es uno de los dos componentes principales. 
    - `Utils/`: Aquí se encuentran archivos de utilidades que contienen funciones y componentes reutilizables en toda la aplicación.
    - `Pages/`: En esta carpeta se encuentran mapView.tsx, la única página de la aplicación y el punto de entrada -> _app.tsx


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
