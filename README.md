<div id="top"></div>

<br />
<div align="center">
  <h2 align="center">Telebank Backend </h2>
</div>


## Technologies

The major technologies that were used to build this project are:

- [NodeJS](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Mongoose](https://mongoosejs.com/)
- [Docker](https://www.docker.com/)


## Getting Started

Here goes the instructions to get the project up and running.

### Prerequisites

To run this project You will need the following things installed on your machine

- NodeJS
- NPM
- MongoDB
- Docker (Optional)

Go inside the `.env` file and specify the following variables of a database server that you are using.

## Project Structure

If you want to add a new route then you will goto `/routes` folder and add a new Router.
Then register that router in the `index.ts` file under the `/routes` folder.

Then you will create a Controller under the `/controllers` directory.All business logics should go into there.

Specific use cases should be handles by Service classes under the `/service` folder.

All Database related things should go under `/repositories` folder.

To create a new model for data base look into the `/models` folder.