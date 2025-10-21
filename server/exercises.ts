import type { Exercise } from "@shared/schema";

// Exercise generation logic for all 4 sections
// Each section has 100 exercises with progressive difficulty

export function generateVariablesExercises(): Exercise[] {
  const exercises: Exercise[] = [];
  const min = 1;
  const max = 50;

  // Integers and floats (70 exercises)
  for (let i = 0; i < 70; i++) {
    if (i % 2 === 0) {
      // Integer operations
      const a = Math.floor(Math.random() * (max - min + 1)) + min;
      const b = Math.floor(Math.random() * (max - min + 1)) + min;
      const ops = [
        { op: '+', result: a + b, name: 'suma' },
        { op: '-', result: a - b, name: 'resta' },
        { op: '*', result: a * b, name: 'multiplicación' },
        { op: '%', result: a % b, name: 'módulo' },
        { op: '//', result: Math.floor(a / b), name: 'división entera' },
      ];
      const chosen = ops[i % 5];

      exercises.push({
        id: `var-int-${i}`,
        sectionId: 'variables',
        prompt: `Define dos variables 'a' y 'b' con los valores ${a} y ${b}. Realiza la operación de ${chosen.name} (${chosen.op}) y guarda el resultado en la variable 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: chosen.result,
        resultType: 'integer',
        difficulty: i < 20 ? 'easy' : i < 50 ? 'medium' : 'hard',
        hints: [
          `Usa el operador ${chosen.op} para realizar la operación`,
          `La sintaxis es: resultado = a ${chosen.op} b`,
          `Primero define a = ${a} y b = ${b}, luego calcula resultado = a ${chosen.op} b`,
        ],
        explanation: `En Python, el operador ${chosen.op} se usa para ${chosen.name}. El resultado de ${a} ${chosen.op} ${b} es ${chosen.result}.`,
      });
    } else {
      // Float operations
      const f1 = parseFloat((Math.random() * 10 + 1).toFixed(2));
      const f2 = parseFloat((Math.random() * 5 + 0.5).toFixed(2));
      const result = parseFloat((f1 * f2).toFixed(2));

      exercises.push({
        id: `var-float-${i}`,
        sectionId: 'variables',
        prompt: `Define dos variables flotantes 'x' e 'y' con los valores ${f1} y ${f2}. Multiplícalas y guarda el resultado redondeado a 2 decimales en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: result,
        resultType: 'float',
        difficulty: i < 20 ? 'easy' : i < 50 ? 'medium' : 'hard',
        hints: [
          'Usa el operador * para multiplicar números flotantes',
          'Puedes usar round(valor, 2) para redondear a 2 decimales',
          `Define x = ${f1} e y = ${f2}, luego resultado = round(x * y, 2)`,
        ],
        explanation: `Los números flotantes en Python se usan para valores decimales. ${f1} * ${f2} = ${result}`,
      });
    }
  }

  // Strings (30 exercises)
  const names = ["Ada", "Alan", "Grace", "Tim", "Guido", "Python", "Code", "Data"];
  for (let i = 70; i < 100; i++) {
    const name = names[i % names.length];
    const num = Math.floor(Math.random() * 90) + 10;

    if (i % 3 === 0) {
      exercises.push({
        id: `var-str-concat-${i}`,
        sectionId: 'variables',
        prompt: `Define una variable 'nombre' con el valor "${name}". Concaténala con el texto "Hola, " y guarda el resultado en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: `Hola, ${name}`,
        resultType: 'string',
        difficulty: 'easy',
        hints: [
          'Usa el operador + para concatenar strings',
          'La sintaxis es: resultado = "Hola, " + nombre',
          `Define nombre = "${name}" y luego concatena con "Hola, "`,
        ],
        explanation: 'En Python, puedes concatenar strings usando el operador +.',
      });
    } else {
      exercises.push({
        id: `var-str-convert-${i}`,
        sectionId: 'variables',
        prompt: `Convierte el número ${num} a una cadena de texto usando la función str() y guárdalo en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: `${num}`,
        resultType: 'string',
        difficulty: 'easy',
        hints: [
          'Usa la función str() para convertir números a strings',
          `La sintaxis es: resultado = str(${num})`,
          `str(${num}) devuelve "${num}" como string`,
        ],
        explanation: 'La función str() convierte cualquier valor a su representación en string.',
      });
    }
  }

  return exercises;
}

export function generateCollectionsExercises(): Exercise[] {
  const exercises: Exercise[] = [];

  // Lists (50 exercises)
  const elements = ["manzana", "banana", "cereza", "durazno"];
  for (let i = 0; i < 50; i++) {
    const method = ['append', 'pop', 'index', 'len'][i % 4];
    const initialList = [...elements].slice(0, 3);

    if (method === 'append') {
      const newItem = elements[3];
      exercises.push({
        id: `col-list-append-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea una lista llamada 'frutas' con los elementos ${JSON.stringify(initialList)}. Usa el método append() para añadir "${newItem}" al final. Guarda la lista completa en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: JSON.stringify([...initialList, newItem]),
        resultType: 'string',
        difficulty: i < 15 ? 'easy' : i < 35 ? 'medium' : 'hard',
        hints: [
          'El método append() añade un elemento al final de la lista',
          'Sintaxis: lista.append(elemento)',
          `Crea frutas = ${JSON.stringify(initialList)}, luego frutas.append("${newItem}")`,
        ],
        explanation: 'append() es un método de listas que añade un elemento al final.',
      });
    } else if (method === 'pop') {
      const lastItem = initialList[initialList.length - 1];
      exercises.push({
        id: `col-list-pop-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea una lista 'items' con ${JSON.stringify(initialList)}. Usa pop() para eliminar y guardar el último elemento en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: lastItem,
        resultType: 'string',
        difficulty: i < 15 ? 'easy' : i < 35 ? 'medium' : 'hard',
        hints: [
          'pop() elimina y devuelve el último elemento',
          'Sintaxis: elemento = lista.pop()',
          'El último elemento es "' + lastItem + '"',
        ],
        explanation: 'pop() elimina y retorna el último elemento de una lista.',
      });
    } else if (method === 'index') {
      const target = initialList[i % initialList.length];
      const idx = initialList.indexOf(target);
      exercises.push({
        id: `col-list-index-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea una lista 'datos' con ${JSON.stringify(initialList)}. Encuentra el índice de "${target}" usando index() y guárdalo en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: idx,
        resultType: 'integer',
        difficulty: i < 15 ? 'easy' : i < 35 ? 'medium' : 'hard',
        hints: [
          'index() devuelve la posición del elemento',
          'Sintaxis: indice = lista.index(elemento)',
          `El índice de "${target}" es ${idx}`,
        ],
        explanation: 'index() retorna la posición (índice) de un elemento en la lista.',
      });
    } else {
      exercises.push({
        id: `col-list-len-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea una lista 'numeros' con ${JSON.stringify(initialList)}. Usa len() para obtener la cantidad de elementos y guárdala en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: initialList.length,
        resultType: 'integer',
        difficulty: 'easy',
        hints: [
          'len() devuelve la cantidad de elementos',
          'Sintaxis: cantidad = len(lista)',
          `La lista tiene ${initialList.length} elementos`,
        ],
        explanation: 'len() retorna el número de elementos en una colección.',
      });
    }
  }

  // Dictionaries (50 exercises)
  for (let i = 50; i < 100; i++) {
    const dict = { nombre: 'Ana', edad: 25, ciudad: 'Madrid' };

    if (i % 3 === 0) {
      exercises.push({
        id: `col-dict-access-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea un diccionario 'persona' con ${JSON.stringify(dict)}. Accede al valor de la clave 'nombre' y guárdalo en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: dict.nombre,
        resultType: 'string',
        difficulty: i < 60 ? 'easy' : i < 85 ? 'medium' : 'hard',
        hints: [
          'Accede a valores del diccionario con dict[clave]',
          'Sintaxis: valor = persona["nombre"]',
          'El valor de "nombre" es "Ana"',
        ],
        explanation: 'Accedes a valores en un diccionario usando la notación de corchetes.',
      });
    } else if (i % 3 === 1) {
      const newDict = { ...dict, profesion: 'Ingeniera' };
      exercises.push({
        id: `col-dict-add-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea un diccionario 'persona' con ${JSON.stringify(dict)}. Añade la clave 'profesion' con valor 'Ingeniera'. Guarda el diccionario completo como JSON string en 'resultado' usando str(dict).`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: JSON.stringify(newDict),
        resultType: 'string',
        difficulty: i < 60 ? 'easy' : i < 85 ? 'medium' : 'hard',
        hints: [
          'Añade elementos con dict[nueva_clave] = valor',
          'Convierte el dict a string con str()',
          'persona["profesion"] = "Ingeniera"',
        ],
        explanation: 'Añades pares clave-valor a un diccionario con la notación de corchetes.',
      });
    } else {
      exercises.push({
        id: `col-dict-pop-${i}`,
        sectionId: 'colecciones',
        prompt: `Crea un diccionario 'data' con ${JSON.stringify(dict)}. Usa pop('edad') para eliminar y guardar el valor de 'edad' en 'resultado'.`,
        starterCode: '# Escribe tu código aquí\n',
        expectedResult: dict.edad,
        resultType: 'integer',
        difficulty: i < 60 ? 'easy' : i < 85 ? 'medium' : 'hard',
        hints: [
          'pop(clave) elimina y retorna el valor',
          'Sintaxis: valor = dict.pop("edad")',
          'El valor de edad es 25',
        ],
        explanation: 'pop() elimina una clave del diccionario y retorna su valor.',
      });
    }
  }

  return exercises;
}

export function generateLoopsExercises(): Exercise[] {
  const exercises: Exercise[] = [];

  for (let i = 0; i < 100; i++) {
    const nums = [1, 5, 10, 20, 3, 7, 12, 8];
    const words = ['sol', 'luna', 'estrella', 'planeta'];

    if (i % 4 === 0) {
      // Sum even/odd numbers
      const isEven = i % 8 === 0;
      const filtered = nums.filter(n => isEven ? n % 2 === 0 : n % 2 !== 0);
      const sum = filtered.reduce((a, b) => a + b, 0);

      exercises.push({
        id: `loop-sum-${i}`,
        sectionId: 'bucles',
        prompt: `Dada la lista numeros = ${JSON.stringify(nums)}, usa un bucle for y una condición if para sumar solo los números ${isEven ? 'pares' : 'impares'}. Guarda la suma en 'resultado'.`,
        starterCode: 'numeros = ' + JSON.stringify(nums) + '\n# Tu código aquí\n',
        expectedResult: sum,
        resultType: 'integer',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          `Usa for num in numeros: para iterar`,
          `Usa if num % 2 == ${isEven ? '0' : '1'}: para filtrar`,
          `Inicializa resultado = 0 y suma con resultado += num`,
        ],
        explanation: `Los bucles for iteran sobre listas. El módulo (%) detecta ${isEven ? 'pares' : 'impares'}.`,
      });
    } else if (i % 4 === 1) {
      // Count items with length >= 5
      const longWords = words.filter(w => w.length >= 5);
      exercises.push({
        id: `loop-count-${i}`,
        sectionId: 'bucles',
        prompt: `Dada la lista palabras = ${JSON.stringify(words)}, cuenta cuántas palabras tienen 5 o más letras. Guarda el conteo en 'resultado'.`,
        starterCode: 'palabras = ' + JSON.stringify(words) + '\n# Tu código aquí\n',
        expectedResult: longWords.length,
        resultType: 'integer',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'Usa for palabra in palabras:',
          'Usa if len(palabra) >= 5:',
          'Incrementa un contador con resultado += 1',
        ],
        explanation: 'len() devuelve la longitud de un string. Combínalo con if para contar.',
      });
    } else if (i % 4 === 2) {
      // Build a new list
      const doubled = nums.slice(0, 4).map(n => n * 2);
      exercises.push({
        id: `loop-build-${i}`,
        sectionId: 'bucles',
        prompt: `Dada la lista valores = ${JSON.stringify(nums.slice(0, 4))}, crea una nueva lista que contenga cada número multiplicado por 2. Guarda la nueva lista en 'resultado'. Usa str(resultado) para convertirla a string.`,
        starterCode: 'valores = ' + JSON.stringify(nums.slice(0, 4)) + '\n# Tu código aquí\n',
        expectedResult: JSON.stringify(doubled),
        resultType: 'string',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'Crea una lista vacía: resultado = []',
          'Usa for val in valores:',
          'Añade el doble con resultado.append(val * 2)',
        ],
        explanation: 'Puedes construir nuevas listas iterando y usando append().',
      });
    } else {
      // Find max
      const max = Math.max(...nums.slice(0, 5));
      exercises.push({
        id: `loop-max-${i}`,
        sectionId: 'bucles',
        prompt: `Dada la lista datos = ${JSON.stringify(nums.slice(0, 5))}, encuentra el número más grande usando un bucle. Guarda el máximo en 'resultado'.`,
        starterCode: 'datos = ' + JSON.stringify(nums.slice(0, 5)) + '\n# Tu código aquí\n',
        expectedResult: max,
        resultType: 'integer',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'Inicializa resultado = datos[0]',
          'Usa for num in datos:',
          'Actualiza resultado si num > resultado',
        ],
        explanation: 'Compara cada elemento con el máximo actual para encontrar el mayor.',
      });
    }
  }

  return exercises;
}

export function generateFunctionsExercises(): Exercise[] {
  const exercises: Exercise[] = [];

  for (let i = 0; i < 100; i++) {
    if (i % 4 === 0) {
      // Simple function with return
      const a = Math.floor(Math.random() * 20) + 1;
      const b = Math.floor(Math.random() * 20) + 1;
      const sum = a + b;

      exercises.push({
        id: `func-simple-${i}`,
        sectionId: 'funciones',
        prompt: `Define una función llamada 'sumar' que reciba dos parámetros (a, b) y retorne su suma. Luego llama a la función con ${a} y ${b}, y guarda el resultado en 'resultado'.`,
        starterCode: '# Define la función aquí\n\n# Llama a la función\n',
        expectedResult: sum,
        resultType: 'integer',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'Usa def sumar(a, b): para definir la función',
          'Retorna el valor con return a + b',
          `Llama con resultado = sumar(${a}, ${b})`,
        ],
        explanation: 'Las funciones encapsulan código reutilizable y usan return para devolver valores.',
      });
    } else if (i % 4 === 1) {
      // Function with string
      const name = ['Ana', 'Luis', 'María', 'Carlos'][i % 4];
      const greeting = `Hola, ${name}!`;

      exercises.push({
        id: `func-string-${i}`,
        sectionId: 'funciones',
        prompt: `Define una función 'saludar' que reciba un parámetro 'nombre' y retorne "Hola, " + nombre + "!". Llámala con "${name}" y guarda el resultado.`,
        starterCode: '# Define la función aquí\n\n# Llama a la función\n',
        expectedResult: greeting,
        resultType: 'string',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'def saludar(nombre):',
          'return "Hola, " + nombre + "!"',
          `resultado = saludar("${name}")`,
        ],
        explanation: 'Las funciones pueden trabajar con strings y concatenarlos.',
      });
    } else if (i % 4 === 2) {
      // Function with list
      const nums = [2, 4, 6, 8];
      const doubled = nums.map(n => n * 2);

      exercises.push({
        id: `func-list-${i}`,
        sectionId: 'funciones',
        prompt: `Define una función 'duplicar_lista' que reciba una lista y retorne una nueva lista con cada elemento multiplicado por 2. Llámala con ${JSON.stringify(nums)} y guarda el resultado como string con str().`,
        starterCode: '# Define la función aquí\n\n# Llama a la función\n',
        expectedResult: JSON.stringify(doubled),
        resultType: 'string',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'def duplicar_lista(lista):',
          'Crea una nueva lista y usa un bucle',
          'Retorna la nueva lista',
        ],
        explanation: 'Las funciones pueden procesar listas y retornar nuevas listas.',
      });
    } else {
      // Function with conditional
      const num = Math.floor(Math.random() * 100) + 1;
      const isEven = num % 2 === 0;

      exercises.push({
        id: `func-cond-${i}`,
        sectionId: 'funciones',
        prompt: `Define una función 'es_par' que reciba un número y retorne True si es par, False si es impar. Llámala con ${num} y guarda el resultado.`,
        starterCode: '# Define la función aquí\n\n# Llama a la función\n',
        expectedResult: isEven,
        resultType: 'boolean',
        difficulty: i < 25 ? 'easy' : i < 70 ? 'medium' : 'hard',
        hints: [
          'def es_par(num):',
          'Usa if num % 2 == 0: return True',
          'else: return False',
        ],
        explanation: 'Las funciones pueden usar condicionales para tomar decisiones.',
      });
    }
  }

  return exercises;
}

export function getAllExercises(): Map<string, Exercise[]> {
  const allExercises = new Map<string, Exercise[]>();
  allExercises.set('variables', generateVariablesExercises());
  allExercises.set('colecciones', generateCollectionsExercises());
  allExercises.set('bucles', generateLoopsExercises());
  allExercises.set('funciones', generateFunctionsExercises());
  return allExercises;
}
