function greet(name: string): string {
  return `Привет, ${name}! Добро пожаловать на наш сайт.`;
};

const greetingMessage: string = greet('user');
console.log(greetingMessage);



const numbers: number[] = [1, 2, 3, 4, 5];
const squaredNumbers: number[] = numbers.map((num: number) => num ** 2);
console.log('Квадраты чисел:', squaredNumbers);