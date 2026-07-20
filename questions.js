// Marginal question banks. Answers are strings so the runtime can normalize
// whitespace/case before comparing user input.

export const probabilityQuestions = [
  {
    id: "prob-001",
    prompt: "A fair coin is flipped once. What is the probability of heads? Give a fraction.",
    answer: "1/2",
    choices: ["1/4", "1/2", "2/3", "1"],
    explanation: "A fair coin has two equally likely outcomes and one is heads, so the probability is 1/2.",
    difficulty: 1,
  },
  {
    id: "prob-002",
    prompt: "A fair coin is flipped 3 times. What is the probability of exactly 2 heads? Give a fraction.",
    answer: "3/8",
    choices: ["1/8", "1/4", "3/8", "1/2"],
    explanation: "There are C(3,2) = 3 favorable sequences among 2^3 = 8 equally likely sequences.",
    difficulty: 1,
  },
  {
    id: "prob-003",
    prompt: "Two fair six-sided dice are rolled. What is the probability of getting at least one 6? Give a fraction.",
    answer: "11/36",
    choices: ["1/6", "5/18", "11/36", "1/3"],
    explanation: "Use the complement: 1 - P(no sixes) = 1 - (5/6)^2 = 11/36.",
    difficulty: 1,
  },
  {
    id: "prob-004",
    prompt: "Two fair six-sided dice are rolled. What is the probability that their sum is 7? Give a fraction.",
    answer: "1/6",
    choices: ["1/12", "1/9", "1/6", "7/36"],
    explanation: "Six ordered outcomes sum to 7 out of 36 total outcomes, so 6/36 = 1/6.",
    difficulty: 1,
  },
  {
    id: "prob-005",
    prompt: "A fair die is known to have rolled a number greater than 3. What is the probability the roll was even? Give a fraction.",
    answer: "2/3",
    choices: ["1/3", "1/2", "2/3", "3/4"],
    explanation: "The conditional sample space is {4, 5, 6}; two of those three values are even.",
    difficulty: 1,
  },
  {
    id: "prob-006",
    prompt: "A bag contains 5 red and 3 blue marbles. One marble is drawn uniformly. What is P(red)?",
    answer: "5/8",
    explanation: "Five of the eight marbles are red, so P(red) = 5/8.",
    difficulty: 1,
  },
  {
    id: "prob-007",
    prompt: "A bag contains 5 red and 3 blue marbles. Two are drawn without replacement. What is the probability both are red? Give a reduced fraction.",
    answer: "5/14",
    choices: ["5/16", "5/14", "3/8", "25/64"],
    explanation: "P(both red) = (5/8)(4/7) = 20/56 = 5/14.",
    difficulty: 2,
  },
  {
    id: "prob-008",
    prompt: "One card is drawn from a standard 52-card deck. What is the probability it is an ace?",
    answer: "1/13",
    choices: ["1/52", "1/26", "1/13", "4/13"],
    explanation: "There are 4 aces among 52 cards, and 4/52 reduces to 1/13.",
    difficulty: 1,
  },
  {
    id: "prob-009",
    prompt: "One card is drawn from a standard deck. What is the probability it is a heart or a king? Give a reduced fraction.",
    answer: "4/13",
    explanation: "There are 13 hearts plus 4 kings, but the king of hearts was counted twice: (13 + 4 - 1)/52 = 4/13.",
    difficulty: 2,
  },
  {
    id: "prob-010",
    prompt: "Two cards are drawn without replacement from a standard deck. What is the probability both are aces? Give a reduced fraction.",
    answer: "1/221",
    choices: ["1/169", "1/221", "1/256", "1/2652"],
    explanation: "P(two aces) = (4/52)(3/51) = 12/2652 = 1/221.",
    difficulty: 2,
  },
  {
    id: "prob-011",
    prompt: "A trial succeeds with probability 0.4. In 5 independent trials, what is P(exactly 3 successes)? Give a decimal.",
    answer: "0.2304",
    explanation: "The binomial probability is C(5,3)(0.4)^3(0.6)^2 = 10(0.064)(0.36) = 0.2304.",
    difficulty: 2,
  },
  {
    id: "prob-012",
    prompt: "What is the expected value of one roll of a fair six-sided die? Give a decimal.",
    answer: "3.5",
    choices: ["3", "3.5", "4", "4.5"],
    explanation: "The mean is (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21/6 = 3.5.",
    difficulty: 1,
  },
  {
    id: "prob-013",
    prompt: "A game pays $10 with probability 0.2 and loses $2 otherwise. What is the expected net payoff in dollars?",
    answer: "0.40",
    choices: ["-0.40", "0", "0.40", "1.60"],
    explanation: "E = 0.2(10) + 0.8(-2) = 2 - 1.6 = $0.40.",
    difficulty: 1,
  },
  {
    id: "prob-014",
    prompt: "Independent events A and B have P(A)=0.6 and P(B)=0.5. What is P(A and B)?",
    answer: "0.3",
    explanation: "For independent events, multiply: 0.6 x 0.5 = 0.3.",
    difficulty: 1,
  },
  {
    id: "prob-015",
    prompt: "P(A)=0.4, P(B)=0.5, and P(A and B)=0.2. What is P(A or B)?",
    answer: "0.7",
    choices: ["0.2", "0.5", "0.7", "0.9"],
    explanation: "Inclusion-exclusion gives 0.4 + 0.5 - 0.2 = 0.7.",
    difficulty: 1,
  },
  {
    id: "prob-016",
    prompt: "P(A and B)=0.2 and P(B)=0.5. What is P(A given B)?",
    answer: "0.4",
    explanation: "P(A|B) = P(A and B) / P(B) = 0.2/0.5 = 0.4.",
    difficulty: 1,
  },
  {
    id: "prob-017",
    prompt: "A disease affects 1% of people. A test has 90% sensitivity and 95% specificity. Given a positive result, what is the probability the person has the disease? Give a percentage to 2 decimals.",
    answer: "15.38%",
    explanation: "Bayes: true-positive mass is 0.01(0.90)=0.009; false-positive mass is 0.99(0.05)=0.0495. The ratio 0.009/0.0585 is 15.38%.",
    difficulty: 3,
  },
  {
    id: "prob-018",
    prompt: "How many 4-digit PINs are possible when digits may repeat and leading zeroes are allowed?",
    answer: "10000",
    choices: ["5040", "9000", "9999", "10000"],
    explanation: "Each of four positions has 10 choices, so 10^4 = 10,000.",
    difficulty: 1,
  },
  {
    id: "prob-019",
    prompt: "How many different 3-person committees can be chosen from 10 people?",
    answer: "120",
    explanation: "Order does not matter, so use C(10,3) = 10!/(3!7!) = 120.",
    difficulty: 2,
  },
  {
    id: "prob-020",
    prompt: "Four distinct books are arranged on a shelf. How many orders are possible?",
    answer: "24",
    choices: ["4", "12", "16", "24"],
    explanation: "There are 4! = 4 x 3 x 2 x 1 = 24 permutations.",
    difficulty: 1,
  },
  {
    id: "prob-021",
    prompt: "Independent trials succeed with probability 0.25. What is the probability the first success occurs on trial 4? Give a decimal.",
    answer: "0.10546875",
    explanation: "The first three trials must fail and the fourth succeed: (0.75)^3(0.25) = 0.10546875.",
    difficulty: 2,
  },
  {
    id: "prob-022",
    prompt: "What is the variance of a Bernoulli random variable with success probability 0.3?",
    answer: "0.21",
    choices: ["0.09", "0.21", "0.30", "0.49"],
    explanation: "A Bernoulli(p) variable has variance p(1-p), so 0.3(0.7) = 0.21.",
    difficulty: 2,
  },
  {
    id: "prob-023",
    prompt: "X is binomial with n=20 and p=0.15. What is E[X]?",
    answer: "3",
    explanation: "A binomial random variable has mean np = 20(0.15) = 3.",
    difficulty: 1,
  },
  {
    id: "prob-024",
    prompt: "A batch has 4 defective and 6 good items. Three are sampled without replacement. What is P(exactly 2 defective)? Give a reduced fraction.",
    answer: "3/10",
    explanation: "The hypergeometric probability is C(4,2)C(6,1)/C(10,3) = 36/120 = 3/10.",
    difficulty: 3,
  },
  {
    id: "prob-025",
    prompt: "A bag has 4 red and 6 blue balls. Two are drawn without replacement. What is P(no red balls)? Give a reduced fraction.",
    answer: "1/3",
    choices: ["1/5", "4/15", "1/3", "3/5"],
    explanation: "Both must be blue: (6/10)(5/9) = 30/90 = 1/3.",
    difficulty: 2,
  },
  {
    id: "prob-026",
    prompt: "An integer is chosen uniformly from 1 through 100. What is the probability it is divisible by 3 or 5? Give a fraction.",
    answer: "47/100",
    explanation: "There are 33 multiples of 3 and 20 of 5; subtract the 6 multiples of 15: 33 + 20 - 6 = 47.",
    difficulty: 2,
  },
  {
    id: "prob-027",
    prompt: "A card drawn from a standard deck is known to be red. What is the probability it is a face card (J, Q, or K)?",
    answer: "3/13",
    choices: ["1/13", "3/26", "3/13", "6/13"],
    explanation: "Among the 26 red cards, 6 are face cards, so 6/26 = 3/13.",
    difficulty: 2,
  },
  {
    id: "prob-028",
    prompt: "Machine A makes 60% of parts with a 2% defect rate. Machine B makes 40% with a 5% defect rate. What percent of all parts are defective?",
    answer: "3.2%",
    explanation: "Total defect probability is 0.60(0.02) + 0.40(0.05) = 0.032 = 3.2%.",
    difficulty: 2,
  },
  {
    id: "prob-029",
    prompt: "Machine A makes 60% of parts with a 2% defect rate; Machine B makes 40% with a 5% defect rate. Given that a part is defective, what is the probability it came from Machine B? Give a percentage.",
    answer: "62.5%",
    explanation: "P(B|defect) = 0.40(0.05)/0.032 = 0.625 = 62.5%.",
    difficulty: 3,
  },
  {
    id: "prob-030",
    prompt: "Two fair six-sided dice are rolled. What is the expected value of the larger result? Give an exact fraction.",
    answer: "161/36",
    explanation: "P(max=k)=(k^2-(k-1)^2)/36=(2k-1)/36. Summing k(2k-1)/36 for k=1..6 gives 161/36.",
    difficulty: 3,
  },
  {
    id: "prob-031",
    prompt: "If random variables X and Y are independent and have finite variances, what is Cov(X,Y)?",
    answer: "0",
    choices: ["-1", "0", "1", "Cannot be determined"],
    explanation: "Independence implies E[XY] = E[X]E[Y], so covariance is zero.",
    difficulty: 2,
  },
  {
    id: "prob-032",
    prompt: "Three distinct letters are randomly permuted. What is the probability that no letter remains in its original position?",
    answer: "1/3",
    explanation: "There are 3! = 6 permutations and 2 derangements, so the probability is 2/6 = 1/3.",
    difficulty: 2,
  },
];

export const pythonQuestions = [
  {
    id: "python-001",
    prompt: "Predict the Python 3 output: print(2 + 3 * 4)",
    answer: "14",
    choices: ["14", "20", "24", "Error"],
    explanation: "Multiplication has higher precedence, so 3 * 4 is evaluated before adding 2.",
    difficulty: 1,
  },
  {
    id: "python-002",
    prompt: "Predict the output: nums = [10, 20, 30]; print(nums[-1])",
    answer: "30",
    explanation: "Index -1 selects the last element of a sequence.",
    difficulty: 1,
  },
  {
    id: "python-003",
    prompt: "Predict the output: print('marginal'[1:4])",
    answer: "arg",
    choices: ["mar", "arg", "argi", "rg"],
    explanation: "A slice includes index 1 and stops before index 4, yielding characters a, r, g.",
    difficulty: 1,
  },
  {
    id: "python-004",
    prompt: "Predict the output: print(sum(range(5)))",
    answer: "10",
    explanation: "range(5) produces 0, 1, 2, 3, 4, whose sum is 10.",
    difficulty: 1,
  },
  {
    id: "python-005",
    prompt: "Predict the output: print(bool([]), bool([0]))",
    answer: "False True",
    choices: ["False False", "False True", "True False", "True True"],
    explanation: "An empty list is falsey. A nonempty list is truthy even when its element is 0.",
    difficulty: 1,
  },
  {
    id: "python-006",
    prompt: "Predict the output: scores = {'Ana': 8}; print(scores.get('Ben', 0))",
    answer: "0",
    explanation: "dict.get returns its supplied default when the key is absent.",
    difficulty: 1,
  },
  {
    id: "python-007",
    prompt: "Predict the output: print([x * x for x in range(6) if x % 2 == 0])",
    answer: "[0, 4, 16]",
    explanation: "The even values from 0 through 5 are 0, 2, and 4; squaring them gives 0, 4, and 16.",
    difficulty: 1,
  },
  {
    id: "python-008",
    prompt: "Fill the blank with one built-in name: count = ___(['a', 'b', 'c'])",
    answer: "len",
    choices: ["count", "len", "size", "sum"],
    explanation: "len(sequence) returns the number of items in a sequence.",
    difficulty: 1,
  },
  {
    id: "python-009",
    prompt: "Fill the function body with one return statement so square(6) returns 36: def square(n): ___",
    answer: "return n * n",
    acceptedAnswers: ["return n ** 2", "return pow(n, 2)"],
    explanation: "Multiplying n by itself produces its square.",
    difficulty: 1,
  },
  {
    id: "python-010",
    prompt: "Predict both output lines:\ndef add(item, items=[]):\n    items.append(item)\n    return items\nprint(add(1))\nprint(add(2))",
    answer: "[1]\n[1, 2]",
    explanation: "The default list is created once and reused, so the second call sees the item appended by the first.",
    difficulty: 2,
  },
  {
    id: "python-011",
    prompt: "Predict the output: a, b = 3, 7; a, b = b, a; print(a, b)",
    answer: "7 3",
    explanation: "Tuple unpacking swaps the two values without a temporary variable.",
    difficulty: 1,
  },
  {
    id: "python-012",
    prompt: "Predict the output: print(-7 // 3)",
    answer: "-3",
    choices: ["-3", "-2", "2", "3"],
    explanation: "Python floor division rounds down toward negative infinity; floor(-2.333...) is -3.",
    difficulty: 2,
  },
  {
    id: "python-013",
    prompt: "Predict the output: print('a,b,c'.split(','))",
    answer: "['a', 'b', 'c']",
    explanation: "split(',') breaks the string at each comma and returns the three pieces in a list.",
    difficulty: 1,
  },
  {
    id: "python-014",
    prompt: "Predict the output: print('-'.join(['x', 'y', 'z']))",
    answer: "x-y-z",
    explanation: "str.join places the receiver string between each list element.",
    difficulty: 1,
  },
  {
    id: "python-015",
    prompt: "Predict the output: words = ['pear', 'fig', 'banana']; print(sorted(words, key=len))",
    answer: "['fig', 'pear', 'banana']",
    explanation: "sorted uses each word's length as its key: 3, 4, then 6 characters.",
    difficulty: 1,
  },
  {
    id: "python-016",
    prompt: "Predict the output: total = sum(i * value for i, value in enumerate([10, 20, 30])); print(total)",
    answer: "80",
    explanation: "enumerate supplies indices 0, 1, 2, so the total is 0*10 + 1*20 + 2*30 = 80.",
    difficulty: 2,
  },
  {
    id: "python-017",
    prompt: "Predict the output: print(dict(zip(['a', 'b'], [1, 2])))",
    answer: "{'a': 1, 'b': 2}",
    explanation: "zip pairs each key with the value in the same position, and dict builds the mapping.",
    difficulty: 1,
  },
  {
    id: "python-018",
    prompt: "Predict the output: seen = {2, 4, 6}; print(4 in seen, 5 in seen)",
    answer: "True False",
    explanation: "4 is a member of the set and 5 is not.",
    difficulty: 1,
  },
  {
    id: "python-019",
    prompt: "Predict the output: print(any([0, '', 3]))",
    answer: "True",
    choices: ["True", "False", "3", "Error"],
    explanation: "any returns True when at least one item is truthy; 3 is truthy.",
    difficulty: 1,
  },
  {
    id: "python-020",
    prompt: "Predict the output:\ndef fact(n):\n    return 1 if n <= 1 else n * fact(n - 1)\nprint(fact(4))",
    answer: "24",
    explanation: "The recursion computes 4 * 3 * 2 * 1 = 24.",
    difficulty: 2,
  },
  {
    id: "python-021",
    prompt: "Predict the output: print({x: x ** 2 for x in range(3)})",
    answer: "{0: 0, 1: 1, 2: 4}",
    explanation: "The dictionary comprehension maps 0, 1, and 2 to their squares. Dictionaries preserve insertion order in modern Python.",
    difficulty: 1,
  },
  {
    id: "python-022",
    prompt: "Fill the blank with one list method name: items = []; items.___(42)  # items should become [42]",
    answer: "append",
    choices: ["add", "append", "extend", "push"],
    explanation: "list.append adds one object to the end of a list.",
    difficulty: 1,
  },
  {
    id: "python-023",
    prompt: "Fill the blank so list(___) evaluates to [1, 2, 3, 4, 5]. Use range.",
    answer: "range(1, 6)",
    explanation: "range includes its start and excludes its stop, so a stop of 6 includes 5.",
    difficulty: 1,
  },
  {
    id: "python-024",
    prompt: "Write the single return statement for clamp(value, low, high), which must keep value between low and high. Use min and max.",
    answer: "return max(low, min(value, high))",
    acceptedAnswers: ["return min(high, max(low, value))"],
    explanation: "The inner min caps value at high, and the outer max raises anything below low.",
    difficulty: 2,
  },
  {
    id: "python-025",
    prompt: "Predict the output:\ndef total(*values):\n    return sum(values)\nprint(total(2, 3, 5))",
    answer: "10",
    explanation: "*values collects the three positional arguments into a tuple, and sum returns 10.",
    difficulty: 1,
  },
  {
    id: "python-026",
    prompt: "Predict the output: g = (x * x for x in range(3)); print(next(g), next(g))",
    answer: "0 1",
    explanation: "The generator yields squares lazily: first 0 squared, then 1 squared.",
    difficulty: 2,
  },
  {
    id: "python-027",
    prompt: "Predict the output: a = [[1], [2]]; b = a.copy(); b[0].append(9); print(a)",
    answer: "[[1, 9], [2]]",
    explanation: "list.copy is shallow, so a and b still reference the same nested lists.",
    difficulty: 2,
  },
  {
    id: "python-028",
    prompt: "Predict the output:\ntry:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print('caught')",
    answer: "caught",
    explanation: "Dividing by zero raises ZeroDivisionError, which the except block handles.",
    difficulty: 1,
  },
  {
    id: "python-029",
    prompt: "Predict the output: print(isinstance(True, int))",
    answer: "True",
    choices: ["True", "False", "TypeError", "None"],
    explanation: "In Python, bool is a subclass of int, so True is an instance of int.",
    difficulty: 2,
  },
  {
    id: "python-030",
    prompt: "Predict the output: pairs = [('a', 2), ('b', 1)]; print(sorted(pairs, key=lambda pair: pair[1]))",
    answer: "[('b', 1), ('a', 2)]",
    explanation: "The lambda selects the second tuple element, so the pair with value 1 sorts first.",
    difficulty: 2,
  },
  {
    id: "python-031",
    prompt: "Predict the output: funcs = [lambda: i for i in range(3)]; print([f() for f in funcs])",
    answer: "[2, 2, 2]",
    explanation: "The lambdas close over the same variable i and look it up when called, after the loop leaves i equal to 2.",
    difficulty: 3,
  },
  {
    id: "python-032",
    prompt: "Fill the right-hand side with one list comprehension that flattens rows: rows = [[1, 2], [3, 4]]; flat = ___",
    answer: "[item for row in rows for item in row]",
    explanation: "The first for chooses each row and the second iterates through that row's items.",
    difficulty: 2,
  },
];

export const cQuestions = [
  {
    id: "c-001",
    prompt: "Predict the C output: printf(\"%d\", 2 + 3 * 4);",
    answer: "14",
    choices: ["14", "20", "24", "Compiler error"],
    explanation: "Multiplication is evaluated before addition, so the expression is 2 + 12.",
    difficulty: 1,
  },
  {
    id: "c-002",
    prompt: "Predict the C output: printf(\"%d\", 5 / 2);",
    answer: "2",
    explanation: "Both operands are int, so integer division discards the fractional part.",
    difficulty: 1,
  },
  {
    id: "c-003",
    prompt: "Predict the C output: printf(\"%.1f\", (double)5 / 2);",
    answer: "2.5",
    choices: ["2", "2.0", "2.5", "3.0"],
    explanation: "Casting 5 to double makes this floating-point division, and %.1f prints one decimal place.",
    difficulty: 1,
  },
  {
    id: "c-004",
    prompt: "Predict the output: int x = 7; int *p = &x; (*p)++; printf(\"%d\", x);",
    answer: "8",
    explanation: "p points to x, so incrementing *p changes x itself from 7 to 8.",
    difficulty: 1,
  },
  {
    id: "c-005",
    prompt: "Predict the output: int a[] = {10, 20, 30}; printf(\"%d\", *(a + 2));",
    answer: "30",
    explanation: "In this expression a points to its first element; advancing two int positions reaches a[2].",
    difficulty: 1,
  },
  {
    id: "c-006",
    prompt: "Predict the output: int a[] = {2, 4, 6, 8, 10}; printf(\"%zu\", sizeof a / sizeof a[0]);",
    answer: "5",
    explanation: "The byte size of the whole array divided by one element's byte size gives its element count.",
    difficulty: 1,
  },
  {
    id: "c-007",
    prompt: "With <string.h> included, predict: char word[] = \"cat\"; printf(\"%zu %zu\", strlen(word), sizeof word);",
    answer: "3 4",
    explanation: "strlen excludes the terminating null byte, while the char array's sizeof includes it.",
    difficulty: 2,
  },
  {
    id: "c-008",
    prompt: "Fill the blank so p points to value: int value = 5; int *p = ___;",
    answer: "&value",
    choices: ["value", "&value", "*value", "&&value"],
    explanation: "The address-of operator & produces the address required by an int pointer.",
    difficulty: 1,
  },
  {
    id: "c-009",
    prompt: "Predict the output: int x = 4; int *p = &x; int **pp = &p; **pp = 9; printf(\"%d\", x);",
    answer: "9",
    explanation: "Dereferencing pp twice reaches x, so the assignment changes x to 9.",
    difficulty: 2,
  },
  {
    id: "c-010",
    prompt: "Fill the one missing statement in this pointer swap: int temp = *a; ___; *b = temp;",
    answer: "*a = *b",
    explanation: "After saving *a, copy *b into *a, then copy the saved value into *b.",
    difficulty: 2,
  },
  {
    id: "c-011",
    prompt: "Predict the output: struct Point { int x; int y; }; struct Point p = {3, 4}; printf(\"%d\", p.x + p.y);",
    answer: "7",
    explanation: "The two struct members contain 3 and 4, whose sum is 7.",
    difficulty: 1,
  },
  {
    id: "c-012",
    prompt: "Predict the output: struct Item { int qty; }; struct Item item = {6}; struct Item *p = &item; p->qty += 2; printf(\"%d\", item.qty);",
    answer: "8",
    explanation: "p->qty accesses item.qty through the pointer and increments it by 2.",
    difficulty: 1,
  },
  {
    id: "c-013",
    prompt: "Predict the output: enum Color { RED = 1, GREEN, BLUE }; printf(\"%d\", BLUE);",
    answer: "3",
    choices: ["0", "1", "2", "3"],
    explanation: "Unassigned enum constants continue from the previous value, so GREEN is 2 and BLUE is 3.",
    difficulty: 1,
  },
  {
    id: "c-014",
    prompt: "Predict the output:\nint next(void) { static int n = 0; return ++n; }\nint a = next(); int b = next(); int c = next();\nprintf(\"%d %d %d\", a, b, c);",
    answer: "1 2 3",
    explanation: "A static local retains its value between calls. The separate-statement assumption removes C's unspecified argument evaluation order.",
    difficulty: 2,
  },
  {
    id: "c-015",
    prompt: "Predict the output: void change(int n) { n = 99; } int x = 5; change(x); printf(\"%d\", x);",
    answer: "5",
    explanation: "C passes x's value to change; assigning to the local parameter does not change x.",
    difficulty: 1,
  },
  {
    id: "c-016",
    prompt: "Predict the output: int sum(int n) { return n == 0 ? 0 : n + sum(n - 1); } printf(\"%d\", sum(4));",
    answer: "10",
    explanation: "The recursion adds 4 + 3 + 2 + 1 before reaching the zero base case.",
    difficulty: 2,
  },
  {
    id: "c-017",
    prompt: "Predict the output: printf(\"%d\", 5 & 3);",
    answer: "1",
    choices: ["0", "1", "3", "7"],
    explanation: "Binary 0101 AND 0011 is 0001.",
    difficulty: 2,
  },
  {
    id: "c-018",
    prompt: "Predict the output: printf(\"%d\", 5 | 3);",
    answer: "7",
    explanation: "Binary 0101 OR 0011 is 0111, which is 7.",
    difficulty: 2,
  },
  {
    id: "c-019",
    prompt: "Predict the output: unsigned int x = 3u; printf(\"%u\", x << 2);",
    answer: "12",
    explanation: "Left shifting unsigned 3 (binary 0011) by two places produces 1100, or 12.",
    difficulty: 2,
  },
  {
    id: "c-020",
    prompt: "Predict the output: int x = 0; if (0 && ++x) { x = 9; } printf(\"%d\", x);",
    answer: "0",
    explanation: "&& short-circuits when its left operand is false, so ++x is never evaluated.",
    difficulty: 2,
  },
  {
    id: "c-021",
    prompt: "Predict the output: int n = 2; switch (n) { case 1: printf(\"A\"); case 2: printf(\"B\"); case 3: printf(\"C\"); break; default: printf(\"D\"); }",
    answer: "BC",
    explanation: "Execution starts at case 2 and falls through case 3 until the break.",
    difficulty: 2,
  },
  {
    id: "c-022",
    prompt: "Predict the output: #define SQUARE(x) x*x followed by printf(\"%d\", SQUARE(1 + 2));",
    answer: "5",
    choices: ["5", "6", "9", "Compiler error"],
    explanation: "The macro expands to 1 + 2 * 1 + 2, which evaluates to 5 because the parameter and result lack parentheses.",
    difficulty: 2,
  },
  {
    id: "c-023",
    prompt: "Fill the replacement text for a safer macro: #define SQUARE(x) ___",
    answer: "((x) * (x))",
    acceptedAnswers: ["(x) * (x)"],
    explanation: "Parenthesizing each use of x and the full result prevents surrounding operators from changing precedence. Side-effecting arguments should still be avoided.",
    difficulty: 3,
  },
  {
    id: "c-024",
    prompt: "Fill the malloc size expression to allocate n ints without repeating the type name: int *values = malloc(___);",
    answer: "n * sizeof *values",
    acceptedAnswers: ["sizeof *values * n", "n * sizeof(*values)", "sizeof(*values) * n"],
    explanation: "sizeof *values tracks the pointed-to type, and multiplying by n reserves room for n elements.",
    difficulty: 2,
  },
  {
    id: "c-025",
    prompt: "Fill the standard-library call that releases a heap allocation referenced by data: ___;",
    answer: "free(data)",
    choices: ["delete(data)", "free(data)", "release(data)", "drop(data)"],
    explanation: "Memory returned by malloc, calloc, or realloc is released with free.",
    difficulty: 1,
  },
  {
    id: "c-026",
    prompt: "Predict the output: int values[] = {4, 8, 12}; int *p = values; p++; printf(\"%d\", *p);",
    answer: "8",
    explanation: "Incrementing an int pointer advances it by one int element, from values[0] to values[1].",
    difficulty: 1,
  },
  {
    id: "c-027",
    prompt: "Predict the output: int grid[2][2] = {{1, 2}, {3, 4}}; printf(\"%d\", grid[1][0]);",
    answer: "3",
    explanation: "Row index 1 is {3, 4}, and column index 0 selects 3.",
    difficulty: 1,
  },
  {
    id: "c-028",
    prompt: "With <string.h> included, predict: int source = 42, dest = 0; memcpy(&dest, &source, sizeof dest); printf(\"%d\", dest);",
    answer: "42",
    explanation: "memcpy copies all bytes of source into dest, so dest receives the same int representation and value.",
    difficulty: 2,
  },
  {
    id: "c-029",
    prompt: "Which comparison is guaranteed true for strcmp(\"1apple\", \"2banana\")?",
    answer: "strcmp(\"1apple\", \"2banana\") < 0",
    choices: ["strcmp(\"1apple\", \"2banana\") == -1", "strcmp(\"1apple\", \"2banana\") < 0", "strcmp(\"1apple\", \"2banana\") == 0", "strcmp(\"1apple\", \"2banana\") > 0"],
    explanation: "The decimal digits are ordered and contiguous in C's execution character set, so the first string is smaller. strcmp guarantees a negative result, but not specifically -1.",
    difficulty: 2,
  },
  {
    id: "c-030",
    prompt: "Fill the standard function name that safely reads at most size-1 characters into buffer from stdin: ___(buffer, size, stdin);",
    answer: "fgets",
    choices: ["gets", "fgets", "scanf", "readline"],
    explanation: "fgets accepts a buffer size and leaves room for a terminating null byte.",
    difficulty: 1,
  },
  {
    id: "c-031",
    prompt: "What does this condition test? int *p = NULL; if (p == NULL) { ... }",
    answer: "p does not point to an object",
    choices: ["p points to integer 0", "p does not point to an object", "the object at p equals 0", "p is uninitialized"],
    explanation: "A null pointer is a distinguished pointer value that points to no object or function.",
    difficulty: 1,
  },
  {
    id: "c-032",
    prompt: "What is wrong with this function? int *bad(void) { int x = 7; return &x; }",
    answer: "it returns a pointer to a local variable whose lifetime has ended",
    choices: ["nothing", "it leaks x", "it returns a pointer to a local variable whose lifetime has ended", "an int cannot have an address"],
    explanation: "x has automatic storage duration and stops existing when bad returns, leaving the returned pointer dangling.",
    difficulty: 2,
  },
];

// SQLite-compatible fixed schema and seed data shared by every SQL problem.
// The UI can expose this once in a collapsible "Schema" panel instead of
// repeating it in every prompt.
export const SQL_SCHEMA = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  order_date TEXT NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE order_items (
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  PRIMARY KEY (order_id, product_id)
);

INSERT INTO users (id, name, city) VALUES
  (1, 'Ana', 'Boston'),
  (2, 'Ben', 'Austin'),
  (3, 'Cara', 'Boston'),
  (4, 'Dev', 'Denver'),
  (5, 'Eli', 'Austin');

INSERT INTO products (id, name, category, price) VALUES
  (1, 'Notebook', 'stationery', 5.00),
  (2, 'Pen', 'stationery', 2.00),
  (3, 'Mug', 'home', 12.00),
  (4, 'Lamp', 'home', 30.00),
  (5, 'Cable', 'tech', 15.00);

INSERT INTO orders (id, user_id, order_date, status) VALUES
  (101, 1, '2026-01-03', 'shipped'),
  (102, 2, '2026-01-04', 'pending'),
  (103, 1, '2026-01-05', 'shipped'),
  (104, 3, '2026-01-07', 'cancelled'),
  (105, 4, '2026-01-08', 'shipped'),
  (106, 2, '2026-01-09', 'shipped');

INSERT INTO order_items (order_id, product_id, quantity) VALUES
  (101, 1, 2),
  (101, 2, 3),
  (102, 3, 1),
  (103, 4, 1),
  (103, 5, 2),
  (104, 2, 5),
  (105, 3, 2),
  (105, 4, 1),
  (106, 5, 1),
  (106, 1, 1);
`.trim();

export const sqlQuestions = [
  {
    id: "sql-001",
    prompt: "What rows does this return? SELECT name FROM users WHERE city = 'Boston' ORDER BY id;",
    answer: "Ana, Cara",
    choices: ["Ana", "Ana, Cara", "Ben, Eli", "Cara, Dev"],
    explanation: "Users 1 and 3 live in Boston, and ordering by id puts Ana before Cara.",
    difficulty: 1,
  },
  {
    id: "sql-002",
    prompt: "What scalar value does this return? SELECT COUNT(*) FROM users;",
    answer: "5",
    explanation: "The sample users table contains five rows.",
    difficulty: 1,
  },
  {
    id: "sql-003",
    prompt: "What rows does this return? SELECT DISTINCT city FROM users ORDER BY city;",
    answer: "Austin, Boston, Denver",
    explanation: "DISTINCT removes repeated Austin and Boston values, and ORDER BY sorts the three remaining cities.",
    difficulty: 1,
  },
  {
    id: "sql-004",
    prompt: "What scalar value does this return? SELECT COUNT(*) FROM orders WHERE status = 'shipped';",
    answer: "4",
    choices: ["2", "3", "4", "6"],
    explanation: "Orders 101, 103, 105, and 106 have status shipped.",
    difficulty: 1,
  },
  {
    id: "sql-005",
    prompt: "Write a query that returns names of products priced above 10, ordered by product id.",
    answer: "SELECT name FROM products WHERE price > 10 ORDER BY id;",
    acceptedAnswers: ["SELECT name FROM products WHERE 10 < price ORDER BY id;"],
    explanation: "WHERE filters prices and ORDER BY id makes the result deterministic: Mug, Lamp, Cable.",
    difficulty: 1,
  },
  {
    id: "sql-006",
    prompt: "What value does this return? SELECT name FROM products ORDER BY price DESC LIMIT 1;",
    answer: "Lamp",
    explanation: "Lamp has the highest sample price at 30.00.",
    difficulty: 1,
  },
  {
    id: "sql-007",
    prompt: "What scalar value does this return? SELECT ROUND(AVG(price), 1) FROM products;",
    answer: "12.8",
    explanation: "The prices total 64; dividing by five products gives 12.8.",
    difficulty: 1,
  },
  {
    id: "sql-008",
    prompt: "What rows does this return? SELECT category, COUNT(*) FROM products GROUP BY category ORDER BY category; Format category: count.",
    answer: "home: 2; stationery: 2; tech: 1",
    explanation: "Home and stationery each have two products; tech has one.",
    difficulty: 1,
  },
  {
    id: "sql-009",
    prompt: "What names are returned, including duplicates? SELECT u.name FROM orders o JOIN users u ON u.id = o.user_id ORDER BY o.id;",
    answer: "Ana, Ben, Ana, Cara, Dev, Ben",
    explanation: "Each order joins to its owner; Ana and Ben each own two orders.",
    difficulty: 1,
  },
  {
    id: "sql-010",
    prompt: "What value is returned? SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL;",
    answer: "Eli",
    explanation: "The LEFT JOIN keeps all users, and the NULL test selects Eli, the only user with no matching order.",
    difficulty: 2,
  },
  {
    id: "sql-011",
    prompt: "What rows does this return? SELECT u.name, COUNT(*) AS n FROM users u JOIN orders o ON o.user_id = u.id GROUP BY u.id, u.name ORDER BY u.id; Format name: n.",
    answer: "Ana: 2; Ben: 2; Cara: 1; Dev: 1",
    explanation: "The inner join excludes Eli and groups the six orders by their four owners.",
    difficulty: 2,
  },
  {
    id: "sql-012",
    prompt: "What names does this return? SELECT u.name FROM users u JOIN orders o ON o.user_id = u.id GROUP BY u.id, u.name HAVING COUNT(*) >= 2 ORDER BY u.id;",
    answer: "Ana, Ben",
    explanation: "HAVING filters the grouped counts; Ana and Ben are the only users with at least two orders.",
    difficulty: 2,
  },
  {
    id: "sql-013",
    prompt: "What scalar value does this return? SELECT SUM(quantity) FROM order_items WHERE order_id = 101;",
    answer: "5",
    choices: ["2", "3", "5", "18"],
    explanation: "Order 101 has two notebooks and three pens, totaling five units.",
    difficulty: 1,
  },
  {
    id: "sql-014",
    prompt: "What scalar value does this return? SELECT printf('%.2f', SUM(oi.quantity * p.price)) FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = 101;",
    answer: "16.00",
    explanation: "Two notebooks cost 10.00 and three pens cost 6.00, for a total of 16.00.",
    difficulty: 2,
  },
  {
    id: "sql-015",
    prompt: "What scalar value does this return? SELECT printf('%.2f', SUM(oi.quantity * p.price)) FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN products p ON p.id = oi.product_id WHERE o.status = 'shipped';",
    answer: "150.00",
    explanation: "The shipped order totals are 16, 60, 54, and 20; together they equal 150.",
    difficulty: 3,
  },
  {
    id: "sql-016",
    prompt: "What row does this return? SELECT p.name, SUM(oi.quantity) AS units FROM products p JOIN order_items oi ON oi.product_id = p.id GROUP BY p.id, p.name ORDER BY units DESC LIMIT 1; Format name: units.",
    answer: "Pen: 8",
    explanation: "Pen quantities are 3 on order 101 and 5 on order 104, totaling 8, more than any other product.",
    difficulty: 2,
  },
  {
    id: "sql-017",
    prompt: "Fill the join condition: SELECT o.id, u.name FROM orders o JOIN users u ON ___;",
    answer: "o.user_id = u.id",
    acceptedAnswers: ["u.id = o.user_id"],
    explanation: "orders.user_id is the foreign key that matches users.id.",
    difficulty: 1,
  },
  {
    id: "sql-018",
    prompt: "Fill the GROUP BY list for a portable aggregate query: SELECT u.name, COUNT(o.id) FROM users u LEFT JOIN orders o ON o.user_id = u.id GROUP BY ___;",
    answer: "u.id, u.name",
    acceptedAnswers: ["u.name, u.id"],
    explanation: "Grouping by both the user's key and selected nonaggregate name works across strict SQL engines.",
    difficulty: 2,
  },
  {
    id: "sql-019",
    prompt: "What scalar value does this return? SELECT COUNT(DISTINCT user_id) FROM orders;",
    answer: "4",
    explanation: "The orders belong to users 1, 2, 3, and 4.",
    difficulty: 1,
  },
  {
    id: "sql-020",
    prompt: "What names does this return? SELECT u.name FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.status = 'shipped') ORDER BY u.id;",
    answer: "Ana, Ben, Dev",
    explanation: "Ana, Ben, and Dev each have at least one shipped order; Cara's order is cancelled and Eli has none.",
    difficulty: 2,
  },
  {
    id: "sql-021",
    prompt: "What name does this return? SELECT u.name FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);",
    answer: "Eli",
    explanation: "NOT EXISTS selects the only user for whom no order row matches.",
    difficulty: 2,
  },
  {
    id: "sql-022",
    prompt: "What rows does this return? SELECT status, COUNT(*) FROM orders GROUP BY status ORDER BY status; Format status: count.",
    answer: "cancelled: 1; pending: 1; shipped: 4",
    explanation: "There is one cancelled order, one pending order, and four shipped orders.",
    difficulty: 1,
  },
  {
    id: "sql-023",
    prompt: "What scalar value does this return? SELECT COUNT(*) FROM orders WHERE order_date >= '2026-01-07';",
    answer: "3",
    explanation: "ISO dates sort chronologically as text here; orders 104, 105, and 106 meet the condition.",
    difficulty: 1,
  },
  {
    id: "sql-024",
    prompt: "What scalar value does this return? SELECT COUNT(*) FROM (SELECT city AS value FROM users UNION SELECT category FROM products);",
    answer: "6",
    explanation: "UNION removes duplicates, leaving three cities and three categories. None of those text values overlap.",
    difficulty: 2,
  },
  {
    id: "sql-025",
    prompt: "What rows does this return? SELECT p.name, COALESCE(SUM(oi.quantity), 0) AS units FROM products p LEFT JOIN order_items oi ON oi.product_id = p.id GROUP BY p.id, p.name ORDER BY p.id; Format name: units.",
    answer: "Notebook: 3; Pen: 8; Mug: 3; Lamp: 2; Cable: 3",
    explanation: "The LEFT JOIN preserves every product while SUM totals its quantities across all order items.",
    difficulty: 3,
  },
  {
    id: "sql-026",
    prompt: "Write an INSERT statement that adds user id 6, name Fay, city Miami. Include the column list.",
    answer: "INSERT INTO users (id, name, city) VALUES (6, 'Fay', 'Miami');",
    acceptedAnswers: [
      "INSERT INTO users (id, city, name) VALUES (6, 'Miami', 'Fay');",
      "INSERT INTO users (name, id, city) VALUES ('Fay', 6, 'Miami');",
      "INSERT INTO users (name, city, id) VALUES ('Fay', 'Miami', 6);",
      "INSERT INTO users (city, id, name) VALUES ('Miami', 6, 'Fay');",
      "INSERT INTO users (city, name, id) VALUES ('Miami', 'Fay', 6);"
    ],
    explanation: "INSERT INTO names the target table and columns, followed by one VALUES tuple in matching order.",
    difficulty: 1,
  },
  {
    id: "sql-027",
    prompt: "Write an UPDATE statement that changes every pending order to shipped.",
    answer: "UPDATE orders SET status = 'shipped' WHERE status = 'pending';",
    acceptedAnswers: ["UPDATE orders SET status = 'shipped' WHERE 'pending' = status;"],
    explanation: "SET supplies the new value and WHERE limits the update to currently pending rows.",
    difficulty: 1,
  },
  {
    id: "sql-028",
    prompt: "Write a DELETE statement that removes cancelled orders.",
    answer: "DELETE FROM orders WHERE status = 'cancelled';",
    acceptedAnswers: ["DELETE FROM orders WHERE 'cancelled' = status;"],
    explanation: "DELETE FROM targets the table and the WHERE clause prevents other statuses from being removed.",
    difficulty: 1,
  },
  {
    id: "sql-029",
    prompt: "What names does this return? SELECT name FROM products WHERE price BETWEEN 5 AND 15 ORDER BY id;",
    answer: "Notebook, Mug, Cable",
    choices: ["Mug only", "Notebook, Mug", "Notebook, Mug, Cable", "Pen, Notebook, Mug, Cable"],
    explanation: "BETWEEN is inclusive, so prices 5, 12, and 15 all qualify.",
    difficulty: 1,
  },
  {
    id: "sql-030",
    prompt: "What names does this return? SELECT name FROM users WHERE LOWER(name) LIKE '%a%' ORDER BY id;",
    answer: "Ana, Cara",
    explanation: "After LOWER, Ana and Cara contain the letter a; the other names do not.",
    difficulty: 1,
  },
  {
    id: "sql-031",
    prompt: "What names does this return? SELECT name FROM products WHERE price > (SELECT AVG(price) FROM products) ORDER BY id;",
    answer: "Lamp, Cable",
    explanation: "The average price is 12.8; Lamp at 30 and Cable at 15 are above it.",
    difficulty: 2,
  },
  {
    id: "sql-032",
    prompt: "What rows does this return? SELECT id, CASE WHEN price >= 15 THEN 'premium' ELSE 'standard' END AS tier FROM products ORDER BY id; Format id: tier.",
    answer: "1: standard; 2: standard; 3: standard; 4: premium; 5: premium",
    explanation: "Only Lamp (30) and Cable (15) meet the inclusive price threshold.",
    difficulty: 2,
  },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(values) {
  return values[randomInt(0, values.length - 1)];
}

function hashSignature(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function mentalMathId(difficulty, signature) {
  return `mentalmath-${difficulty}-${hashSignature(`${difficulty}|${signature}`)}`;
}

function formatNumber(value) {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
}

function nonFiveUnitsNumber(minTens, maxTens) {
  const units = pick([1, 2, 3, 4, 6, 7, 8, 9]);
  return randomInt(minTens, maxTens) * 10 + units;
}

export function generateMentalMathTier1() {
  const kind = randomInt(0, 3);

  if (kind === 0) {
    const a = randomInt(10, 99);
    const b = randomInt(2, 50);
    return {
      id: mentalMathId(1, `add|${a}|${b}`),
      prompt: `${a} + ${b} = ?`,
      answer: String(a + b),
      explanation: `${a} + ${b} = ${a + b}.`,
      difficulty: 1,
    };
  }

  if (kind === 1) {
    const a = randomInt(2, 12);
    const b = randomInt(2, 12);
    return {
      id: mentalMathId(1, `multiply|${a}|${b}`),
      prompt: `${a} x ${b} = ?`,
      answer: String(a * b),
      explanation: `${a} x ${b} = ${a * b}.`,
      difficulty: 1,
    };
  }

  if (kind === 2) {
    const spec = pick([
      { percent: 10, divisor: 10 },
      { percent: 25, divisor: 4 },
      { percent: 50, divisor: 2 },
    ]);
    const base = spec.divisor * randomInt(2, 30);
    const result = (base * spec.percent) / 100;
    return {
      id: mentalMathId(1, `percent|${spec.percent}|${base}`),
      prompt: `What is ${spec.percent}% of ${base}?`,
      answer: formatNumber(result),
      explanation: `${spec.percent}% of ${base} is ${formatNumber(result)}.`,
      difficulty: 1,
    };
  }

  const a = nonFiveUnitsNumber(1, 8);
  const b = nonFiveUnitsNumber(1, 8);
  const roundedA = Math.round(a / 10) * 10;
  const roundedB = Math.round(b / 10) * 10;
  return {
    id: mentalMathId(1, `estimate-add-tens|${a}|${b}`),
    prompt: `Estimate ${a} + ${b} by rounding each number to the nearest 10, then adding.`,
    answer: String(roundedA + roundedB),
    explanation: `${a} rounds to ${roundedA} and ${b} rounds to ${roundedB}; ${roundedA} + ${roundedB} = ${roundedA + roundedB}.`,
    difficulty: 1,
  };
}

export function generateMentalMathTier2() {
  const kind = randomInt(0, 4);

  if (kind === 0) {
    const divisor = randomInt(3, 12);
    const quotient = randomInt(4, 25);
    const dividend = divisor * quotient;
    return {
      id: mentalMathId(2, `divide|${dividend}|${divisor}`),
      prompt: `${dividend} / ${divisor} = ?`,
      answer: String(quotient),
      explanation: `${divisor} x ${quotient} = ${dividend}, so ${dividend} / ${divisor} = ${quotient}.`,
      difficulty: 2,
    };
  }

  if (kind === 1) {
    const a = randomInt(6, 18);
    const b = randomInt(3, 12);
    const product = a * b;
    const c = randomInt(5, Math.max(5, product - 1));
    return {
      id: mentalMathId(2, `multiply-subtract|${a}|${b}|${c}`),
      prompt: `${a} x ${b} - ${c} = ?`,
      answer: String(product - c),
      explanation: `Multiply first: ${a} x ${b} = ${product}; then ${product} - ${c} = ${product - c}.`,
      difficulty: 2,
    };
  }

  if (kind === 2) {
    const spec = pick([
      { percent: 15, divisor: 20 },
      { percent: 20, divisor: 5 },
      { percent: 30, divisor: 10 },
      { percent: 40, divisor: 5 },
      { percent: 75, divisor: 4 },
    ]);
    const base = spec.divisor * randomInt(5, 30);
    const result = (base * spec.percent) / 100;
    return {
      id: mentalMathId(2, `percent|${spec.percent}|${base}`),
      prompt: `What is ${spec.percent}% of ${base}?`,
      answer: formatNumber(result),
      explanation: `${spec.percent}/100 x ${base} = ${formatNumber(result)}.`,
      difficulty: 2,
    };
  }

  if (kind === 3) {
    const percent = pick([10, 20, 25, 30]);
    const original = randomInt(2, 20) * 20;
    const discount = (original * percent) / 100;
    const salePrice = original - discount;
    return {
      id: mentalMathId(2, `discount|${original}|${percent}`),
      prompt: `An item costs $${original}. What is its price after a ${percent}% discount?`,
      answer: formatNumber(salePrice),
      explanation: `The discount is $${formatNumber(discount)}, so $${original} - $${formatNumber(discount)} = $${formatNumber(salePrice)}.`,
      difficulty: 2,
    };
  }

  const a = nonFiveUnitsNumber(2, 9);
  const b = nonFiveUnitsNumber(2, 9);
  const roundedA = Math.round(a / 10) * 10;
  const roundedB = Math.round(b / 10) * 10;
  return {
    id: mentalMathId(2, `estimate-multiply-tens|${a}|${b}`),
    prompt: `Estimate ${a} x ${b} by rounding each factor to the nearest 10, then multiplying.`,
    answer: String(roundedA * roundedB),
    explanation: `${a} rounds to ${roundedA} and ${b} rounds to ${roundedB}; ${roundedA} x ${roundedB} = ${roundedA * roundedB}.`,
    difficulty: 2,
  };
}

export function generateMentalMathTier3() {
  const kind = randomInt(0, 4);

  if (kind === 0) {
    const fraction = pick([
      { numerator: 3, denominator: 8 },
      { numerator: 5, denominator: 12 },
      { numerator: 7, denominator: 10 },
      { numerator: 5, denominator: 6 },
    ]);
    const multiplier = randomInt(3, 20);
    const whole = fraction.denominator * multiplier;
    const result = fraction.numerator * multiplier;
    return {
      id: mentalMathId(3, `fraction|${fraction.numerator}|${fraction.denominator}|${whole}`),
      prompt: `What is ${fraction.numerator}/${fraction.denominator} of ${whole}?`,
      answer: String(result),
      explanation: `${whole} / ${fraction.denominator} = ${multiplier}, then ${multiplier} x ${fraction.numerator} = ${result}.`,
      difficulty: 3,
    };
  }

  if (kind === 1) {
    const spec = pick([
      { percent: 12.5, divisor: 8 },
      { percent: 15, divisor: 20 },
      { percent: 25, divisor: 4 },
    ]);
    const original = spec.divisor * randomInt(10, 40);
    const increase = (original * spec.percent) / 100;
    const result = original + increase;
    return {
      id: mentalMathId(3, `increase|${original}|${spec.percent}`),
      prompt: `Increase ${original} by ${spec.percent}%.`,
      answer: formatNumber(result),
      explanation: `${spec.percent}% of ${original} is ${formatNumber(increase)}; adding it gives ${formatNumber(result)}.`,
      difficulty: 3,
    };
  }

  if (kind === 2) {
    const percent = pick([20, 25, 40]);
    const divisor = percent === 20 ? 5 : percent === 25 ? 4 : 5;
    const original = divisor * randomInt(15, 60);
    const salePrice = original * (1 - percent / 100);
    return {
      id: mentalMathId(3, `reverse-discount|${salePrice}|${percent}`),
      prompt: `After a ${percent}% discount, an item costs $${formatNumber(salePrice)}. What was the original price?`,
      answer: formatNumber(original),
      explanation: `The sale price is ${100 - percent}% of the original, so ${formatNumber(salePrice)} / ${formatNumber(1 - percent / 100)} = ${original}.`,
      difficulty: 3,
    };
  }

  if (kind === 3) {
    const original = randomInt(4, 20) * 25;
    const afterIncrease = original * 1.2;
    const finalValue = afterIncrease * 0.8;
    return {
      id: mentalMathId(3, `increase-decrease|${original}|20`),
      prompt: `Start with ${original}. Increase it by 20%, then decrease the result by 20%. What is the final value?`,
      answer: formatNumber(finalValue),
      explanation: `${original} x 1.20 = ${formatNumber(afterIncrease)}, then ${formatNumber(afterIncrease)} x 0.80 = ${formatNumber(finalValue)}. Equal percentage changes do not cancel.`,
      difficulty: 3,
    };
  }

  const nearbyBase = randomInt(4, 16) * 50;
  const actual = nearbyBase + pick([-12, -8, -4, 4, 8, 12]);
  const targetPercent = pick([19, 21]);
  const result = nearbyBase * 0.2;
  return {
    id: mentalMathId(3, `estimate-percent|${targetPercent}|${actual}|${nearbyBase}`),
    prompt: `Estimate ${targetPercent}% of ${actual} by using 20% of the nearest multiple of 50.`,
    answer: formatNumber(result),
    explanation: `${actual} is nearest to ${nearbyBase}; 20% is one fifth, and ${nearbyBase} / 5 = ${formatNumber(result)}.`,
    difficulty: 3,
  };
}

export const mentalMathGenerators = {
  1: generateMentalMathTier1,
  2: generateMentalMathTier2,
  3: generateMentalMathTier3,
};

export function generateMentalMath(difficulty = 1) {
  const tier = Math.max(1, Math.min(3, Math.round(Number(difficulty) || 1)));
  return mentalMathGenerators[tier]();
}

// Short aliases make the module's one-bank-per-subject contract explicit.
export const probability = probabilityQuestions;
export const python = pythonQuestions;
export const c = cQuestions;
export const sql = sqlQuestions;
