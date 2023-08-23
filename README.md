# NAND-UI

NAND-UI is a web-based application that empowers users to design complex computer circuits using fundamental logic gates: AND, OR, and NOT. This project is a tribute to the fascinating world of digital logic design and is inspired by the DIY 8-bit computer movement.

## Table of Contents

- [Getting Started](#getting-started)
  - [Development Setup](#development-setup)
  - [Building the Project](#building-the-project)
- [Project Details](#project-details)
- [Acknowledgments](#acknowledgments)
- [Disclaimer](#disclaimer)

## Getting Started

Follow these steps to set up and run NAND-UI on your local machine.

### Development Setup

1. **Install Dependencies:** Start by installing project dependencies using the following command:

```bash
yarn
```

1. **Run Development Server:** Launch the development server with:

```bash
yarn dev
```

## Building the Project

To create a production-ready build of the application, follow these steps:

1. **Build the App:** Generate the optimized build with the following command:

```bash
yarn build
```

1. **Serve the Application:** Serve the contents of the `/dist` folder. Locally, you can do this with:

```bash
yarn preview
```

## Project Details

NAND-UI is primarily a React-based application with additional functionality provided by json-server for simple data persistence. Here's how it works:

Upon loading in the browser, the application fetches the current circuit state from the data.json file. This state includes information about nodes, edges, and custom node types.

Any modifications made to the circuit design in the web editor are automatically saved back to the data.json file via the json-server instance.

## Acknowledgments

NAND-UI draws inspiration from various sources, including:

1. [NAND to Tetris](https://www.nand2tetris.org/)
2. [Ben Eater's 8-bit breadboard computer](https://www.youtube.com/watch?v=HyznrdDSSGM&list=PLowKtXNTBypGqImE405J2565dvjafglHU&ab_channel=BenEater)
3. [Sebastian Lague's channel](https://www.youtube.com/watch?v=QZwneRb-zqA&list=PLFt_AvWsXl0dPhqVsKt1Ni_46ARyiCGSq&ab_channel=SebastianLague)

Special thanks to [Sebastian Lague](https://github.com/SebLague) for his project [Digital-Logic-Sim](https://github.com/SebLague/Digital-Logic-Sim) and the incredible React package reactflow, which inspired this endeavor.

## Disclaimer

Please note that NAND-UI is a personal pet project. While it offers a unique experience in digital logic design, it may have limitations, bugs, or areas for improvement. This project does not necessarily reflect the author's professional style or work ethic. Use it for learning and exploration, and feel free to contribute to its enhancement.
