import type { Lesson, Resource } from "../types";
import { U } from "../unis";

// AI engineer track, Week 1: linear algebra. Anchor lecture: MIT 18.06 (Gilbert Strang), Lectures 1–2.
// Maths in \( \) or \[ \]; h`...` keeps backslashes.
const h = String.raw;

const V: Record<string, Resource> = {
  lintrans: {title:"Linear transformations and matrices — Essence of linear algebra, chapter 3", src:"3Blue1Brown", len:"11 min", url:"https://www.youtube.com/watch?v=kYB8IZa5AuE"},
  composition: {title:"Matrix multiplication as composition — Essence of linear algebra, chapter 4", src:"3Blue1Brown", len:"10 min", url:"https://www.youtube.com/watch?v=XkY2DOUCWMU"},
  numpy: {title:"Learn NumPy in 5 minutes — Python Programmer", len:"14 min", url:"https://www.youtube.com/watch?v=xECXZ3tyONo"},
  broadcast: {title:"Learn NumPy broadcasting in 6 minutes — Bro Code", len:"6 min", url:"https://www.youtube.com/watch?v=P67wiuTx7l0"}
};

const R: Record<string, Resource> = {
  ocw: {title:"MIT 18.06 Linear Algebra — lecture notes, problem sets and exams (OpenCourseWare)", url:"https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"},
  mml: {title:"Mathematics for Machine Learning (Deisenroth, Faisal, Ong), Chapters 2–3, free PDF", url:"https://mml-book.github.io"},
  cs229notes: {title:"Stanford CS229 main lecture notes (Andrew Ng, Tengyu Ma)", url:"https://cs229.stanford.edu/main_notes.pdf"},
  d2l: {title:"Dive into Deep Learning, 2.3 Linear algebra", url:"https://d2l.ai/chapter_preliminaries/linear-algebra.html"},
  numpy: {title:"NumPy: broadcasting", url:"https://numpy.org/doc/stable/user/basics.broadcasting.html"}
};

export const week1: Lesson[] = [
{
  id:"1-1", title:"Vectors, dot products and similarity", mins:25,
  objectives:[
    "Represent data (images, words, documents) as vectors in \\(\\mathbb{R}^n\\)",
    "Compute and interpret the dot product, the norm and the angle between two vectors",
    "Prove that ranking by cosine similarity and ranking by Euclidean distance agree for unit vectors",
    "Estimate the compute and memory cost of brute-force vector search",
  ],
  prereqs:"<p>School algebra and some programming. No linear algebra is assumed.</p>",
  body:h`
<h3>1. Everything is a vector</h3>
<p>A vector \(x \in \mathbb{R}^n\) is an ordered list of \(n\) real numbers \(x = (x_1, \dots, x_n)\). It can be read in three equivalent ways: as a <b>list</b> (what the computer stores), an <b>arrow</b> from the origin (direction and length) or a <b>point</b> in \(n\)-dimensional space.</p>
<p>Machine learning turns everything into vectors. A 28×28 greyscale image is a vector in \(\mathbb{R}^{784}\). An embedding model maps a sentence to a vector in, say, \(\mathbb{R}^{768}\), so that sentences with similar meanings land near each other. A patient record becomes a vector of age, temperature, heart rate and symptom flags. Once data is a vector, "similar" becomes a geometric question.</p>

<h3>2. The two operations</h3>
<p>Vectors can be <b>added</b> component by component, \((x + y)_i = x_i + y_i\), and <b>scaled</b>, \((cx)_i = c\,x_i\). Combining the two gives a <b>linear combination</b> \(c_1 v_1 + c_2 v_2 + \dots + c_k v_k\), which is the most important idea in this course: in the next lecture a matrix–vector product turns out to be exactly a linear combination of the matrix's columns.</p>

<h3>3. The dot product</h3>
<p>The dot product of \(x, y \in \mathbb{R}^n\) is</p>
\[x \cdot y = x^\top y = \sum_{i=1}^{n} x_i y_i .\]
<p>It has a geometric meaning:</p>
\[x \cdot y = \|x\|\,\|y\| \cos\theta, \qquad \|x\| = \sqrt{x \cdot x},\]
<p>where \(\theta\) is the angle between the vectors and \(\|x\|\) is the length (Euclidean norm). So the dot product is large and positive when the vectors point the same way, zero when they are perpendicular (<b>orthogonal</b>), and negative when they point in opposite directions.</p>
<p><b>Cauchy–Schwarz inequality.</b> \(|x \cdot y| \le \|x\|\,\|y\|\), with equality exactly when one vector is a multiple of the other. This guarantees \(\cos\theta\) lies in \([-1, 1]\), so the angle is well defined in any number of dimensions.</p>

<h3>4. Cosine similarity</h3>
<p>Dividing out the lengths leaves only the direction:</p>
\[\cos(x, y) = \frac{x \cdot y}{\|x\|\,\|y\|}.\]
<p><b>Worked example.</b> Let \(a = (1, 2, 2)\) and \(b = (2, 0, 1)\). Then \(a \cdot b = 2 + 0 + 2 = 4\), \(\|a\| = \sqrt{1+4+4} = 3\), \(\|b\| = \sqrt{4+0+1} = \sqrt 5 \approx 2.236\), so \(\cos(a,b) = 4 / (3 \times 2.236) \approx 0.596\), an angle of about 53°.</p>
<p>Embedding search, recommendation and RAG all rank items by this number. Most embedding APIs return vectors already normalised to length 1, and then cosine similarity is simply the dot product.</p>

<h3>5. Why this is the core of neural networks</h3>
<p>A single artificial neuron computes \(w \cdot x + b\) and passes it through a non-linearity. The weights \(w\) are a learned "template", and the dot product measures how well the input matches it. A layer is many neurons side by side, which is a matrix, the subject of the next lecture.</p>

<h3>Summary</h3>
<ul>
<li>Data becomes vectors; similarity becomes geometry.</li>
<li>\(x \cdot y = \sum x_i y_i = \|x\|\|y\|\cos\theta\).</li>
<li>Cosine similarity compares direction only; for unit vectors it equals the dot product.</li>
<li>A neuron is a dot product plus a bias.</li>
</ul>`,
  watch:[U.vectors3b1b, U.strang1],
  read:[R.mml, R.d2l],
  exercise:h`<p>Write a Python function <code>cosine(x, y)</code> using only lists and loops, then the same with NumPy in one line. Create 1,000 random vectors in \(\mathbb{R}^{300}\), pick one as the query and return the five most similar. Check the plain-Python and NumPy versions give the same answer, and time both.</p>`,
  problems:[
    {q:h`<p>Let \(u = (3, 4)\) and \(v = (4, -3)\). Compute \(u \cdot v\), \(\|u\|\) and \(\|v\|\). What is the angle between them?</p>`,
     a:h`<p>\(u \cdot v = 12 - 12 = 0\), \(\|u\| = \sqrt{9+16} = 5\) and \(\|v\| = 5\). The dot product is zero, so they are orthogonal: the angle is 90°.</p>`},
    {q:h`<p>Show that for unit vectors (\(\|x\| = \|y\| = 1\)), sorting by smallest Euclidean distance \(\|x - y\|\) gives the same order as sorting by largest cosine similarity.</p>`,
     a:h`<p>Expand: \(\|x - y\|^2 = (x-y)\cdot(x-y) = \|x\|^2 + \|y\|^2 - 2\,x\cdot y = 2 - 2\cos\theta\). Distance squared is a decreasing function of \(\cos\theta\), so the smallest distance always corresponds to the largest cosine. This is why vector databases can use either metric on normalised embeddings.</p>`},
    {q:h`<p>You store 1 million document embeddings of dimension 768 as 32-bit floats and search them by brute force. How much memory do they need, and how many multiply-adds does one query take?</p>`,
     a:h`<p>Memory: \(10^6 \times 768 \times 4\) bytes \(\approx 3.07\) GB. One query takes one dot product per document: \(10^6 \times 768 \approx 7.7 \times 10^8\) multiply-adds. A modern CPU doing tens of billions of multiply-adds a second takes a few tens of milliseconds, which is fine for one user but expensive at scale. That is the motivation for approximate nearest-neighbour indexes (Week 18).</p>`},
    {q:h`<p>Use Cauchy–Schwarz to show that \(\|x + y\| \le \|x\| + \|y\|\) (the triangle inequality).</p>`,
     a:h`<p>\(\|x+y\|^2 = \|x\|^2 + 2\,x\cdot y + \|y\|^2 \le \|x\|^2 + 2\|x\|\|y\| + \|y\|^2 = (\|x\| + \|y\|)^2\), using \(x \cdot y \le |x\cdot y| \le \|x\|\|y\|\). Both sides are non-negative, so take square roots.</p>`}
  ],
  quiz:[
    {q:"Two embedding vectors have cosine similarity 0. What does that mean?", o:["They are identical","They are orthogonal: no shared direction","One is the negative of the other","One of them is the zero vector"], a:1, why:"Cosine 0 means a 90° angle: the dot product is zero."},
    {q:"If both vectors have length 1, cosine similarity equals:", o:["Their Euclidean distance","Their dot product","The sum of their entries","1 minus their dot product"], a:1, why:"The denominator ‖x‖‖y‖ is 1, so cosine is just x·y."},
    {q:"What does a single neuron compute before its non-linearity?", o:["A matrix inverse","A dot product of weights and inputs, plus a bias","The length of the input","A sorting of the inputs"], a:1, why:"A neuron computes w·x + b; the weights act as a template the input is matched against."}
  ]
},
{
  id:"1-2", title:"Matrices: the row picture, the column picture and layers", mins:30,
  objectives:[
    "Compute \\(Ax\\) in both the row picture and the column picture",
    "Multiply matrices, check shapes and count the cost",
    "Write a neural-network layer and a batch of inputs as matrix products",
    "Count the parameters and FLOPs of a small network",
  ],
  prereqs:"<p>Lesson 1.1 (vectors and dot products).</p>",
  body:h`
<h3>1. A matrix is a linear map</h3>
<p>An \(m \times n\) matrix \(A\) takes a vector \(x \in \mathbb{R}^n\) to \(Ax \in \mathbb{R}^m\). Strang's first lecture shows that there are two ways to see this product, and you need both.</p>

<h3>2. The row picture</h3>
<p>Each entry of \(Ax\) is the dot product of one <b>row</b> of \(A\) with \(x\):</p>
\[(Ax)_i = \sum_{j=1}^{n} A_{ij}\, x_j = (\text{row } i) \cdot x .\]
<p>In the row picture each equation of \(Ax = b\) is a line (in 2D) or a plane (in 3D), and a solution is a point where they all meet.</p>

<h3>3. The column picture</h3>
<p>Equivalently, \(Ax\) is a <b>linear combination of the columns</b> of \(A\), weighted by the entries of \(x\):</p>
\[Ax = x_1 a_1 + x_2 a_2 + \dots + x_n a_n .\]
<p>So solving \(Ax = b\) asks: <em>which combination of the columns produces \(b\)?</em> And the set of all \(Ax\) (the <b>column space</b>) is everything the matrix can produce.</p>
<p><b>Worked example</b> (Strang's 2×2 example). Let \(A = \begin{pmatrix} 2 & -1 \\ -1 & 2 \end{pmatrix}\) and \(x = (1, 2)\).</p>
<p>Row picture: \((2\cdot1 - 1\cdot2,\ -1\cdot1 + 2\cdot2) = (0, 3)\).<br>Column picture: \(1\cdot(2, -1) + 2\cdot(-1, 2) = (2-2,\ -1+4) = (0, 3)\). Same answer, different insight.</p>

<h3>4. Matrix multiplication is composition</h3>
<p>If \(A\) is \(m \times n\) and \(B\) is \(n \times p\), then \(AB\) is \(m \times p\), with \((AB)_{ij} = (\text{row } i \text{ of } A)\cdot(\text{column } j \text{ of } B)\). Applying \(AB\) to a vector means "apply \(B\), then \(A\)". Three facts to know by heart:</p>
<ul>
<li><b>Shapes:</b> inner dimensions must match: \((m \times n)(n \times p) = m \times p\).</li>
<li><b>Cost:</b> \(mnp\) multiply-adds, often written \(2mnp\) FLOPs. Almost all the compute in a transformer is this.</li>
<li><b>Order matters:</b> in general \(AB \ne BA\). But \((AB)^\top = B^\top A^\top\) and \((AB)C = A(BC)\).</li>
</ul>

<h3>5. A neural-network layer is a matrix product</h3>
<p>A layer with \(n\) inputs and \(m\) outputs stores a weight matrix \(W \in \mathbb{R}^{m \times n}\) and a bias \(b \in \mathbb{R}^m\), and computes</p>
\[h = \sigma(Wx + b),\]
<p>where \(\sigma\) is applied element by element. Each row of \(W\) is one neuron's template (lesson 1.1). For a <b>batch</b> of \(B\) inputs stacked as the rows of \(X \in \mathbb{R}^{B \times n}\), the whole batch is one matrix product: \(H = \sigma(XW^\top + b)\), which GPUs compute very efficiently.</p>

<h3>Summary</h3>
<ul>
<li>Row picture: each output is a dot product. Column picture: the output is a combination of columns.</li>
<li>\((m\times n)(n\times p)\) costs \(mnp\) multiply-adds.</li>
<li>Layers, batches, attention and embeddings are all matrix products.</li>
</ul>`,
  watch:[V.lintrans, V.composition],
  read:[R.ocw, R.mml],
  exercise:h`<p>Implement <code>matvec(A, x)</code> twice in plain Python, once with the row picture and once with the column picture, and check both against <code>A @ x</code> in NumPy on random 50×30 matrices. Then implement a two-layer forward pass \(\sigma(W_2\,\sigma(W_1 x + b_1) + b_2)\) for a batch of 32 inputs using only <code>@</code> and broadcasting.</p>`,
  problems:[
    {q:h`<p>Let \(A = \begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix}\) and \(B = \begin{pmatrix} 1 & 0 \\ 3 & 1 \end{pmatrix}\). Compute \(AB\) and \(BA\).</p>`,
     a:h`<p>\(AB = \begin{pmatrix} 1\cdot1+2\cdot3 & 1\cdot0+2\cdot1 \\ 0\cdot1+1\cdot3 & 0\cdot0+1\cdot1 \end{pmatrix} = \begin{pmatrix} 7 & 2 \\ 3 & 1 \end{pmatrix}\), and \(BA = \begin{pmatrix} 1 & 2 \\ 3 & 7 \end{pmatrix}\). They are different, so matrix multiplication is not commutative.</p>`},
    {q:h`<p>A network maps 784 inputs to a hidden layer of 128 to 10 outputs, with biases. How many parameters does it have, and roughly how many FLOPs does one forward pass take per example?</p>`,
     a:h`<p>Parameters: \(784 \times 128 + 128 = 100{,}480\) and \(128 \times 10 + 10 = 1{,}290\), so <b>101,770</b>. FLOPs: about \(2 \times (784 \times 128 + 128 \times 10) = 2 \times 101{,}632 \approx 2.0 \times 10^5\) per example. A useful rule: a forward pass costs about \(2 \times\) (number of parameters) FLOPs per input. You will meet it again for transformers.</p>`},
    {q:h`<p>Without computing anything, decide whether \(b = (1, 1)\) is in the column space of \(\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}\).</p>`,
     a:h`<p>The second column is twice the first, so every combination is a multiple of \((1, 2)\). The column space is the line through \((1,2)\), and \((1,1)\) is not on it. So \(Ax = (1,1)\) has no solution.</p>`},
    {q:h`<p>\(X\) is \(32 \times 784\) (a batch of inputs) and \(W\) is \(128 \times 784\). Which of \(XW\), \(XW^\top\), \(WX\) and \(W^\top X\) is defined, and what is its shape?</p>`,
     a:h`<p>Only \(XW^\top\): \((32 \times 784)(784 \times 128) = 32 \times 128\), one row of 128 hidden values per example. In the others the inner dimensions don't match. Checking shapes like this catches most bugs in model code.</p>`}
  ],
  quiz:[
    {q:"In the column picture, Ax is:", o:["A dot product of A with itself","A combination of the columns of A weighted by the entries of x","The rows of A added together","Always the zero vector"], a:1, why:"Ax = x₁a₁ + x₂a₂ + … + xₙaₙ."},
    {q:"What does multiplying a 64×512 matrix by a 512×1000 matrix cost?", o:["64 × 1000 multiply-adds","64 × 512 × 1000 multiply-adds","512 multiply-adds","It isn't defined"], a:1, why:"(m×n)(n×p) costs mnp multiply-adds."},
    {q:"Why do GPUs process inputs in batches?", o:["To save memory","Because a batch turns many matrix-vector products into one matrix-matrix product, which hardware runs far more efficiently","Because models can't process one input","To make results random"], a:1, why:"One large matrix product uses the hardware much better than many small ones."}
  ]
},
{
  id:"1-3", title:"Solving Ax = b: elimination, rank and least squares", mins:30,
  objectives:[
    "Solve a linear system by elimination and back substitution",
    "Recognise a singular system and explain it with rank",
    "Derive the normal equations and fit a line by least squares",
  ],
  prereqs:"<p>Lessons 1.1 and 1.2.</p>",
  body:h`
<h3>1. Elimination</h3>
<p>Strang's second lecture solves \(Ax = b\) the way a computer does: subtract multiples of one equation from the others until the system is upper triangular, then solve from the bottom up (<b>back substitution</b>).</p>
<p><b>Worked example</b> (from Lecture 2):</p>
\[\begin{aligned} x + 2y + z &= 2 \\ 3x + 8y + z &= 12 \\ 4y + z &= 2 \end{aligned}\]
<p>Row 2 minus 3 × row 1 gives \(2y - 2z = 6\). Row 3 minus 2 × (new row 2) gives \(5z = -10\). The <b>pivots</b> are 1, 2 and 5. Back substitution: \(z = -2\), then \(2y + 4 = 6\) so \(y = 1\), then \(x + 2 - 2 = 2\) so \(x = 2\). Check in the original equations: \(2 + 2 - 2 = 2\), \(6 + 8 - 2 = 12\), \(4 - 2 = 2\). ✓</p>
<p>Elimination costs about \(\tfrac{2}{3}n^3\) operations for \(n\) equations, so doubling the size makes it eight times slower.</p>

<h3>2. When elimination fails: singular matrices and rank</h3>
<p>If a pivot is zero and no row exchange fixes it, the matrix is <b>singular</b>: some column is a combination of the others, so the columns don't reach every \(b\). The <b>rank</b> \(r\) is the number of pivots, which is the number of independent columns. For an \(n \times n\) matrix:</p>
<ul>
<li>\(r = n\): exactly one solution for every \(b\) (the matrix is invertible).</li>
<li>\(r \lt n\): no solution for most \(b\), and infinitely many for the \(b\) in the column space.</li>
</ul>

<h3>3. The machine-learning case: more equations than unknowns</h3>
<p>In ML we have far more data points than parameters. Fitting a line \(y = c + mx\) through 1,000 points gives 1,000 equations in 2 unknowns, and there's no exact solution. So instead we minimise the squared error:</p>
\[\hat{x} = \arg\min_x \|Ax - b\|^2 .\]
<p>The best \(A\hat{x}\) is the projection of \(b\) onto the column space, so the error \(b - A\hat{x}\) must be orthogonal to every column: \(A^\top(b - A\hat{x}) = 0\). That gives the <b>normal equations</b>:</p>
\[A^\top A\, \hat{x} = A^\top b .\]
<p><b>Worked example.</b> Fit a line to \((0,1), (1,2), (2,2)\). Each row of \(A\) is \((1, x_i)\):</p>
\[A = \begin{pmatrix} 1 & 0 \\ 1 & 1 \\ 1 & 2 \end{pmatrix},\quad b = \begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix},\quad A^\top A = \begin{pmatrix} 3 & 3 \\ 3 & 5 \end{pmatrix},\quad A^\top b = \begin{pmatrix} 5 \\ 6 \end{pmatrix}.\]
<p>Solving \(3c + 3m = 5\) and \(3c + 5m = 6\) gives \(m = \tfrac12\) and \(c = \tfrac76\). The residuals \((-\tfrac16, \tfrac13, -\tfrac16)\) sum to zero and are orthogonal to \((0,1,2)\), exactly as the normal equations require.</p>
<p>This is linear regression, the first model in Stanford CS229. In Week 3 you will solve the same problem by gradient descent, which is how every neural network is trained.</p>

<h3>4. In code: never invert</h3>
<p>Use <code>np.linalg.solve(A, b)</code> for square systems and <code>np.linalg.lstsq(A, b)</code> for least squares. Computing \((A^\top A)^{-1}\) explicitly is slower and loses accuracy when the columns are nearly dependent (an <em>ill-conditioned</em> matrix).</p>

<h3>Summary</h3>
<ul>
<li>Elimination plus back substitution solves \(Ax=b\) in \(O(n^3)\).</li>
<li>Rank is the number of independent columns, and it decides whether solutions exist and are unique.</li>
<li>With more equations than unknowns, solve \(A^\top A \hat x = A^\top b\): this is linear regression.</li>
</ul>`,
  watch:[U.strang2, U.cs229_2],
  read:[R.ocw, R.cs229notes],
  exercise:h`<p>Implement Gaussian elimination with back substitution in plain Python (no row exchanges needed for your test cases) and check it against <code>np.linalg.solve</code> on random 10×10 systems. Then generate 200 noisy points from \(y = 3 + 2x\), fit them with the normal equations and with <code>np.linalg.lstsq</code>, and show both recover values close to 3 and 2.</p>`,
  problems:[
    {q:h`<p>Solve by elimination: \(2x + y = 5\), \(x + 3y = 10\).</p>`,
     a:h`<p>Row 2 minus \(\tfrac12\) × row 1: \(\tfrac52 y = \tfrac{15}{2}\), so \(y = 3\). Then \(2x + 3 = 5\), so \(x = 1\). The pivots are 2 and \(\tfrac52\).</p>`},
    {q:h`<p>What is the rank of \(\begin{pmatrix} 1 & 2 \\ 2 & 4 \end{pmatrix}\)? How many solutions does \(Ax = b\) have for \(b = (3, 6)\) and for \(b = (3, 5)\)?</p>`,
     a:h`<p>Rank 1: elimination leaves a zero second pivot. \(b = (3,6)\) is in the column space (it's 3 × the first column), so there are infinitely many solutions, for example \((3, 0)\) and \((1, 1)\). \(b = (3,5)\) is not, so there is no solution.</p>`},
    {q:h`<p>Fit \(y = c + mx\) by least squares to \((1,1), (2,3), (3,4)\).</p>`,
     a:h`<p>\(A^\top A = \begin{pmatrix} 3 & 6 \\ 6 & 14 \end{pmatrix}\) and \(A^\top b = (8, 19)\). From \(3c + 6m = 8\) and \(6c + 14m = 19\): subtracting twice the first equation gives \(2m = 3\), so \(m = 1.5\) and \(c = -\tfrac13\). Residuals: \((-\tfrac16, \tfrac13, -\tfrac16)\).</p>`},
    {q:h`<p>Show that if the columns of \(A\) are independent, then \(A^\top A\) is invertible, so the least-squares solution is unique.</p>`,
     a:h`<p>Suppose \(A^\top A x = 0\). Then \(x^\top A^\top A x = \|Ax\|^2 = 0\), so \(Ax = 0\). Independent columns mean the only combination giving zero is \(x = 0\). So \(A^\top A\) has only the trivial null space, which means it is invertible.</p>`}
  ],
  quiz:[
    {q:"The rank of a matrix is:", o:["Its number of rows","The number of independent columns (the number of pivots)","Its largest entry","Its determinant"], a:1, why:"Rank counts the pivots, which equals the number of independent columns."},
    {q:"Why do we use least squares in machine learning?", o:["Because the matrices are always square","Because there are more data points than parameters, so no exact solution exists","Because it's faster than elimination","Because it guarantees zero error"], a:1, why:"An overdetermined system has no exact solution, so we minimise the squared error instead."},
    {q:"The least-squares error vector b − Ax̂ is:", o:["Zero","Orthogonal to every column of A","Parallel to b","Equal to x̂"], a:1, why:"That orthogonality condition is exactly the normal equations Aᵀ(b − Ax̂) = 0."}
  ]
},
{
  id:"1-4", title:"Linear algebra in code: NumPy, shapes and speed", mins:20,
  objectives:[
    "Vectorise loops into array operations",
    "Predict the result shape of broadcasting",
    "Build a nearest-neighbour search over normalised vectors with one matrix product",
  ],
  prereqs:"<p>Lessons 1.1–1.3, and Python.</p>",
  body:h`
<h3>1. Why vectorise</h3>
<p>A Python loop runs one multiply-add at a time through the interpreter. <code>A @ B</code> hands the whole job to optimised BLAS libraries that use SIMD instructions, caches and many cores, so it is often 100–1,000× faster. The rule: <b>write maths as whole-array operations</b>, the way it looks on paper.</p>

<h3>2. Shapes are the type system</h3>
<p>Write the shape next to every array while you work: <code>X: (B, n)</code>, <code>W: (m, n)</code>, <code>X @ W.T: (B, m)</code>. Almost every bug in model code is a shape bug, and most of them show up as an error only if you are lucky.</p>

<h3>3. Broadcasting</h3>
<p>When shapes differ, NumPy compares them from the right; dimensions must be equal or 1, and a 1 is stretched. So <code>(B, m) + (m,)</code> adds the bias to every row, and <code>(B, 1) * (B, m)</code> scales each row. Broadcasting is convenient and dangerous: <code>(B,) - (B, 1)</code> silently produces a <code>(B, B)</code> matrix.</p>

<h3>4. Nearest-neighbour search in three lines</h3>
<pre>E = E / np.linalg.norm(E, axis=1, keepdims=True)   # (N, d): unit rows
q = q / np.linalg.norm(q)                           # (d,)
top5 = np.argsort(-(E @ q))[:5]                     # cosine = dot product</pre>
<p>That's lesson 1.1 (normalise, so cosine is the dot product) plus lesson 1.2 (a matrix–vector product computes all \(N\) dot products at once).</p>

<h3>5. Precision</h3>
<p>NumPy defaults to 64-bit floats; deep learning uses 32-bit, 16-bit and lower. Lower precision halves memory and speeds up computation but loses accuracy: in 16-bit, \(1 + 10^{-4}\) rounds to 1. You will see why that matters in Month 4 (quantisation).</p>`,
  watch:[V.numpy, V.broadcast],
  read:[R.numpy, R.d2l],
  exercise:h`<p>This is the Week 1 build. Generate 1,000 vectors in \(\mathbb{R}^{384}\). Implement nearest-neighbour search three ways: pure Python loops, NumPy with a Python loop over documents, and the fully vectorised version above. Time each with <code>timeit</code> and plot the times on a log scale. In your write-up, use the lesson 1.2 cost formula to predict the time, and compare the prediction with what you measured.</p>`,
  problems:[
    {q:h`<p>What shape is the result of each, or does it fail? (a) <code>(32, 128) + (128,)</code> (b) <code>(32, 128) + (32,)</code> (c) <code>(32, 1) * (1, 10)</code></p>`,
     a:h`<p>(a) <code>(32, 128)</code>: the bias is added to every row. (b) Error: comparing from the right, 128 ≠ 32. Use <code>(32, 1)</code> to add one value per row. (c) <code>(32, 10)</code>: an outer product made by broadcasting.</p>`},
    {q:h`<p>In float16, why might <code>sum</code> of 100,000 values each about 0.01 come out badly wrong?</p>`,
     a:h`<p>float16 has about 3 significant decimal digits. Once the running total reaches the hundreds, adding 0.01 changes it by less than its rounding step, so the additions are lost. Accumulate in float32 (which frameworks do inside matrix multiplications), or sum in blocks.</p>`}
  ],
  quiz:[
    {q:"Why is A @ B so much faster than triple-nested Python loops?", o:["It skips some multiplications","It runs optimised compiled code that uses SIMD, caches and many cores","It uses less precision","It caches answers"], a:1, why:"Same arithmetic, but executed by optimised BLAS code instead of the interpreter."},
    {q:"(B,) − (B, 1) in NumPy gives:", o:["A (B,) vector","An error","A (B, B) matrix: a common silent bug","A scalar"], a:2, why:"Broadcasting stretches both to (B, B). Check shapes explicitly."}
  ]
}
];
