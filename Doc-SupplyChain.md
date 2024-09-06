# Proyecto

## Descripción

Este proyecto es una aplicación web desarrollada con React , utilizando TypeScript, que permite llevar la trazabilidad de determinados producto. Emite un NFT con dicha trazabilidad en el momento en que que finaliza el ciclo de producto. Integra tecnologías blockchain como web3auth y ethers para interactuar con contratos inteligentes desplegados en la testnet ¿Sepolia? y Pinata para subir los metadatos del NFT a IPFS. El backend está desarrollado en Solidity y utiliza el framework Foundry para testing, despliegue y análisis de gas.

## Repositorio

https://github.com/Wave-Labs-Tech/.........................CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR-

## Requisitos previos

- Node.js (versión recomendada: 14.x o superior) (Para el front)
- Yarn (versión recomendada: 1.22.x o superior) Para el front, utilizar fuera de la carpeta foundry
- Git
- Foundry (para el desarrollo y testing de contratos inteligentes)

### Frontend

(Para trabajar con el front no es imprescindible que los contratos esten junto al front. Son independientes.) - React

### Backend (Contratos Inteligentes)

(Para trabajar con el back no es imprescindible que el front este junto a los contratos. Son independientes.) - Solidity - OpenZeppelin Contracts - Foundry

## Instalación

1. Clonar el Repositorio base de web3auth

   npx degit Web3Auth/web3auth-pnp-examples/web-modal-sdk/quick-starts/react-modal-quick-start w3a-quick-start

NOTA: Si se ejecuta de ese modo creará una nueva carpeta llamada BusinessCard con todo el proyecto dentro. Si añades una espacio y un punto ( .) al final del comando no crerá una nueva carpeta, generará todos los archivos del proyecto en la carpeta en la que se estés.

NOTA: Ejecutando el comando code . se abrirá directamente el proyecto en Visual Studio Code

2. Moverse al directorio si aún no se está en él

cd w3a-quick-start

3. Instalar Dependencias

yarn install

4. Instalar Web3 package en el proyecto

yarn add @web3auth/modal @web3auth/base @web3auth/ethereum-provider

5. Adaptar chainConfig en App.tsx a la blockchain a utilizar

Como ejempplo, esta seria la implementación para arbitrumSepolia:

const chainConfig = {
chainId: "0x66eee", // Es necesario el numero en hexadecimal, se puede buscar en chainlist
rpcTarget: process.env.REACT_APP_ARBITRUM_SEPOLIA_RPC_URL || "",
chainNamespace: CHAIN_NAMESPACES.EIP155,
displayName: "Arbitrum Sepolia",
blockExplorerUrl: "https://arbiscan.io/",
ticker: "AETH",
tickerName: "AETH",
logo: "https://images.toruswallet.io/eth.svg",
};

6. Es necesario proporcionar un clientID. Hay que ir a https://dashboard.web3auth.io/ y generar un proyecto si no se dispone de uno.
   Necesario guardarlo en el .env de este modo REACT_APP_CLIENT_ID=BOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXDY
   y recuperarlo desde app.tsx de este modo const clientId = process.env.REACT_APP_CLIENT_ID

Si dotenv no está instalado instalarlo usando yarn add dotenv

7.  Integración con IPFS usando Pinata
    Para almacenar los metadatos de los NFTs en IPFS, utilizamos Pinata como nodo de IPFS. Sigue estos pasos para configurar y utilizar Pinata en el proyecto:

        Crear una cuenta en Pinata:
        Regístrate en Pinata si aún no tienes una cuenta.
        Obtener las claves API:
        Una vez registrado, ve a la sección "API Keys" y crea una nueva clave API. Obtendrás un API Key y un API Secret.
        Configurar variables de entorno:
        Añade las siguientes variables a tu archivo .env:

    REACT_APP_PINATA_KEY=tu_api_key_de_pinata
    REACT_APP_PINATA_SECRET=tu_api_secret_de_pinata

8.  Instalación de Foundry (No es necesario instalarlo constantemente, solo en caso de no estar ya instalado. Y si se desea tener juntos front y back, que no es necesario.) Video de referencia sobre Foundry: https://www.youtube.com/watch?v=K83Y9NMSBVo

Foundry es una herramienta de desarrollo para contratos inteligentes que facilita la compilación, testeo y despliegue de contratos. Para instalarlo:

- Instala Foundry utilizando el siguiente comando:

curl -L https://foundry.paradigm.xyz | bash

NOTA: Aunque se utilice en Windows es necesario ejecutar el comando en
Git Bash, WSL, o Cygwin.

- Añade Foundry a tu PATH y verifica la instalación:

foundryup

- Verificar la Instalación:

  Reinicia tu Terminal:
  Después de ejecutar foundryup, cierra y vuelve a abrir tu terminal para asegurarte de que los cambios en el PATH se apliquen.

  Verifica la Instalación:
  Ejecuta el siguiente comando para verificar que Foundry esté instalado y que los comandos estén disponibles:

  forge --version

  Esto debería mostrar la versión de forge, que es una de las herramientas principales de Foundry.

- Actualizar Foundry (Opcional):

  Si necesitas actualizar Foundry en el futuro, simplemente ejecuta foundryup en tu terminal. Esto descarga e instala la última versión de las herramientas de Foundry.

- Inicializa Foundry en tu proyecto si aún no lo has hecho:

forge init ó forge init nombreDelProyecto

forge init —no-commit (para proyectos con git iniciado)

- Instalar los contratos de Openzeppelin si son necesarios:

forge install --no-commit OpenZeppelin/openzeppelin-contracts (--no-commit evita problemas si git ya está iniciado)

La estructura de proyecto podría verse así:

nombre-del-proyecto/
├── src/
│ └── MyContract.sol
├── test/
│ └── MyContract.t.sol
├── lib/
│ └── openzeppelin-contracts/ (donde está la biblioteca instalada)
├── foundry.toml

Dentro de los archivos Solidity, se pueden importar contratos desde OpenZeppelin:

// Ejemplo de contrato en src/MyContract.sol
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
constructor() ERC20("MyToken", "MTK") {
\_mint(msg.sender, 1000 \* 10 \*\* decimals());
}
}

- Verificación de la Instalación

Para asegurarte de que todo está bien configurado, puedes ejecutar:

forge build

4. Configuración del Proyecto

   TailwindCSS: Asegúrate de que los archivos de configuración tailwind.config.js y postcss.config.js estén presentes en la raíz del proyecto para aplicar los estilos correctamente.

   Variables de Entorno:

   Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
   REACT_APP_CLIENT_ID= proyecto en web3auth para que permita conectar usuarios a la Dapp son un simple email u otra cuenta web2
   REACT_APP_ARBITRUM_SEPOLIA_RPC_URL= el RPC de Alchemy o Infura, en este caso para arbitrumSepolia
   REACT_APP_WALLET_PRIVATE_KEY= la clave privada de una dirección
   REACT_APP_PINATA_KEY=tu_api_key_de_pinata
   REACT_APP_PINATA_SECRET=tu_api_secret_de_pinata

## Uso

### Desarrollo

Para iniciar el servidor de desarrollo:

yarn start

### Construcción

Para construir el proyecto para producción:

yarn build

### Linting

Para ejecutar el linter:

yarn lint

### Formateo de código

Para formatear el código usando Prettier:

yarn format

## Testing de contratos inteligentes

### Ejecución de Tests

- Para ejecutar tests específicos de Foundry:

forge test --mc nombreDelContratoDelTest --mt nombreDelTestEnParticular -vvvvv
Nota: El número de 'v' (de una a cinco) determina el nivel de detalle en la salida del test.

### Evaluar el Coverage (covertura) de los test

Para generar un reporte de cobertura de tests:

forge coverage

Esto te proporcionará un informe detallado de la cobertura de código de tus tests, ayudándote a identificar qué partes del contrato no están cubiertas por las pruebas.

### Evaluación de coste de Gas

Para analizar el consumo de gas de tus contratos inteligentes:

forge snapshot

### Obtener la ABI

Para obtener la ABI (Interfaz de Binario Abierto) de tus contratos inteligentes:

forge inspect SupplyChainToken abi > SupplyChainToken.abi.json (En este caso SupplyChainToken es el nombre del contrato)

Para que muestre la ABI en consola:

forge inspect SupplyChainToken abi

Para obtener una versión más legible del ABI:

forge inspect SupplyChainToken abi --pretty

## Tecnologías principales

### Frontend

- React: Biblioteca de JavaScript para construir interfaces de usuario.
- TypeScript: Superset tipado de JavaScript.
- Ethers: Biblioteca para interactuar con Ethereum.
- Web3auth: Permite utilizar una cuenta y la billetera de manera sencilla para el usuario
- Web3.js: Biblioteca para interactuar con Ethereum en el navegador. (la utiliza web3auth)
- Axios: Permite subir los datos a IPFS a través de Pinata
- TailwindCSS: Framework de CSS utilitario.

### Backend (Contratos Inteligentes)

- Solidity: Lenguaje de programación para escribir contratos inteligentes.
- Foundry: Toolkit para desarrollo de aplicaciones Ethereum.
- OpenZeppelin: Biblioteca para desarrollo seguro de contratos inteligentes.

## Dependencias Principales

### Frontend

- Axios: ^1.7.2
- Ethers: ^6.13.1
- React: ^18.11.18
- React Query: ^5.45.1
- React-toastify: ^10.0.5, (para feedbak al usuario)
- TailwindCSS: ^3.4.4 (para estilos)
- Truncate-eth-address: ^1.0.2 (evita mostrar la address completa del user)
- TypeScript: ^4.9.4
- Web3: ^4.7.0
- Web3auth/modal: ^8.6.2

### Backend (Contratos Inteligentes)

- Solidity: ^0.8.0
- OpenZeppelin Contracts: ^4.9.0
- Foundry: latest version

## Herramientas de Desarrollo

- ESLint: ^8.57.0
- Prettier: ^3.3.2
- PostCSS: ^8.4.38
- Autoprefixer: ^10.4.19

## Despliegue

El proyecto está desplegado en la testnet Sepolia de Ethereum. Asegúrate de tener ETH de prueba en esta red para interactuar con los contratos inteligentes.

- Comando de ejemplo:

# forge script script/Staker.s.sol:StakerDeploy --rpc-url https://arbitrum-sepolia.blockpi.network/v1/rpc/public --private-key f0e -PrivateKeyReal-be19 --verify --etherscan-api-key 4KZ-ApiKeyRealB41 -vvv

(Sería -> forge script script/nombreDelScript --rpc-url la url del RCP de Alchemy con su KEY si la tiene --private-key privateKeyDeLaAdrressQueDespliega --verify (para verificar el contrato en Etherscan) -etherscan-api-key (api key de Etherscan, es necesario obtenerla desde la web))

- Despligue sin usar script: forge create src/MyContract.sol:MyContract --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID --private-key YOUR_PRIVATE_KEY

NOTA: Las variables tipo api key se podrían declarar previamente y referenciarlas para no tener que escribirlas en el comando, pero no funciona en Windows.

- Despliegue en local con Anvil (una de las funcionalidades de Foundry): A estudiar. CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR-CORREGIR

## Despliegue en local

Para iniciar Anvil, simplemente ejecuta el siguiente comando en tu terminal:

anvil

forge create SupplyChainToken --interactive

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios mayores antes de crear un pull request.

## Licencia

[Incluir información sobre la licencia aquí]

### Otros comandos de yarn

- yarn install (instalar todo lo incluido en el package.json)
- yarn upgrade (actualizar los paquetes dentro del package.json a las ultimas versiones permitidas)
- yarn add <pkg> (instalar solo el paquete indicado)
- yarn remove <pkg> (eliminar solo el paquete indicado)
- yarn add <pkg> --dev (instalar un paquete y asegurarse de que se incluye en el package.json)
- yarn upgrade <pkg> (actualizar unicamente el paquete indicado)
- yarn <script> (ejecutar un script, por ejemplo yarn start para que se inicie la app)
- yarn init (comienza un nuevo proyecto o convierte un directorio existente en un proyecto de Node.js gestionado por Yarn.)
- yarn outdated ( muestra una lista de las dependencias en el yarn.lock con una versión más reciente disponible)
- yarn list (muestra todas las dependencias instaladas en el proyecto)
- yarn list --pattern <pkg> (comprobar si un paquete esta instalado)
- usando la flag -y acepta todas las configuraciones predeterminadas (como nombre del proyecto, versión, descripción, etc.) sin preguntarte nada. Por ejemplo yarn install -y

## NOTA: Se necesitarían ciertos elementos propios de la empresa para usar en los proyectos, por ejemplo un RPC en Alchemy de Wave.labs.tech, algunas cuentas para desarrollo, un proyecto en web3auth, Pinata, etc.

## UTILIDADES

- Asi se puede probar en la terminal si un nodo esta funcionando bien:

$headers = @{ "Content-Type" = "application/json" }
$body = '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

Invoke-RestMethod -Uri https://arb-sepolia.g.alchemy.com/v2/eGXXXX---API-KEY---XXXKu -Method Post -Headers $headers -Body $body

- Debe responder algo asi:
  jsonrpc id result

---

2.0 1 0x499e65f
