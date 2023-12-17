/* 
Filename: sophisticatedCode.js

Description: This code demonstrates a complex and creative solution to the traveling salesman problem using a genetic algorithm.

Note: This code requires the 'lodash' library to be installed.

To execute this code, simply run it in a JavaScript environment that has 'lodash' library included.
*/

const _ = require('lodash');

class GeneticAlgorithm {
  constructor(graph, populationSize, mutationRate, elitism) {
    this.graph = graph;
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.elitism = elitism;
    this.cities = Object.keys(graph);
    this.population = [];

    this.bestDistance = Infinity;
    this.bestPath = [];

    this.initialize();
  }

  initialize() {
    for (let i = 0; i < this.populationSize; i++) {
      const path = _.shuffle(this.cities);
      this.population.push(path);
    }
  }

  calculateFitness(path) {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const source = path[i];
      const target = path[i + 1];
      distance += this.graph[source][target];
    }
    return 1 / distance; // Fitness is inverse of the distance
  }

  evaluate() {
    for (const path of this.population) {
      const fitness = this.calculateFitness(path);
      if (fitness < this.bestDistance) {
        this.bestDistance = fitness;
        this.bestPath = path;
      }
    }
  }

  crossover(parentA, parentB) {
    const start = _.random(0, this.cities.length - 2);
    const end = _.random(start + 1, this.cities.length - 1);
    const child = parentA.slice(start, end);
    for (const city of parentB) {
      if (!child.includes(city)) {
        child.push(city);
      }
    }
    return child;
  }

  mutate(path) {
    for (let i = 0; i < path.length; i++) {
      if (Math.random() < this.mutationRate) {
        const j = _.random(0, path.length - 1);
        [path[i], path[j]] = [path[j], path[i]];
      }
    }
    return path;
  }

  evolve() {
    const newPopulation = [];

    if (this.elitism) {
      newPopulation.push(this.bestPath);
    }

    while (newPopulation.length < this.populationSize - 1) {
      const parentA = this.selectParent();
      const parentB = this.selectParent();
      const child = this.crossover(parentA, parentB);
      newPopulation.push(this.mutate(child));
    }

    this.population = newPopulation;
  }

  selectParent() {
    let totalFitness = 0;
    for (const path of this.population) {
      totalFitness += this.calculateFitness(path);
    }

    let random = Math.random() * totalFitness;
    for (const path of this.population) {
      random -= this.calculateFitness(path);
      if (random <= 0) {
        return path;
      }
    }

    // Fallback to returning the last path
    return this.population[this.population.length - 1];
  }
}

// Example usage
const graph = {
  A: { B: 10, C: 20, D: 30 },
  B: { A: 10, C: 40, D: 50 },
  C: { A: 20, B: 40, D: 60 },
  D: { A: 30, B: 50, C: 60 },
};

const populationSize = 200;
const mutationRate = 0.01;
const elitism = true;

const ga = new GeneticAlgorithm(graph, populationSize, mutationRate, elitism);

for (let i = 0; i < 1000; i++) {
  ga.evaluate();
  ga.evolve();
}

console.log("Best Path: ", ga.bestPath);
console.log("Best Distance: ", 1 / ga.bestDistance);
```

This code implements a genetic algorithm to solve the traveling salesman problem. It uses a population of paths, where each path represents a possible solution. The fitness of each path is calculated based on the total distance traveled. The algorithm then evolves the population by selecting parents, performing crossover operations, and applying mutation. The best path and distance are tracked throughout the algorithm's iterations. The example usage section demonstrates how to use the GeneticAlgorithm class with a provided graph, population size, mutation rate, and elitism option.