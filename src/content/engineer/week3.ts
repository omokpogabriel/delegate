import type { Lesson, Resource } from "../types";
import { U } from "../unis";

// AI engineer track, Week 3: learning as optimisation. Anchor lecture: Stanford CS229 Lecture 2 (used in lesson 1.3),
// here backed by MIT 18.06 on least squares and 3Blue1Brown / StatQuest on gradient descent.
// Maths in \( \) or \[ \]; h`...` keeps backslashes.
const h = String.raw;
const yt = (id: string) => `https://www.youtube.com/watch?v=${id}`;

const V: Record<string, Resource> = {
  calculus: {title:"The essence of calculus — Essence of calculus, chapter 1", src:"3Blue1Brown", len:"17 min", url:yt("WUvTyaaNkzM")},
  gradient: {title:"Gradient", src:"Khan Academy · Multivariable calculus", len:"6 min", url:yt("tIpKfDc295M")},
  proj: {title:"Projections onto subspaces — Gilbert Strang", src:"MIT 18.06 Linear Algebra · Lecture 15", len:"49 min", url:yt("Y_Ac6KiQ1t0")},
  lsq: {title:"Projection matrices and least squares — Gilbert Strang", src:"MIT 18.06 Linear Algebra · Lecture 16", len:"48 min", url:yt("osh80YCg_GM")},
  gdstep: {title:"Gradient descent, step-by-step", src:"StatQuest", len:"24 min", url:yt("sDv4f4s2SB8")},
  sgd: {title:"Stochastic gradient descent, clearly explained", src:"StatQuest", len:"11 min", url:yt("vMh0zPT0tLI")},
  ridge: {title:"Regularization part 1: ridge (L2) regression", src:"StatQuest", len:"20 min", url:yt("Q81RR3yKn30")},
  ridgelasso: {title:"Ridge vs lasso regression, visualized", src:"StatQuest", len:"9 min", url:yt("Xm2C_gTAl8c")}
};

const R: Record<string, Resource> = {
  cs229notes: {title:"Stanford CS229 main lecture notes, Part I: linear regression (Andrew Ng, Tengyu Ma)", url:"https://cs229.stanford.edu/main_notes.pdf"},
  mml: {title:"Mathematics for Machine Learning, Chapters 5 (vector calculus) and 9 (linear regression)", url:"https://mml-book.github.io"},
  d2l: {title:"Dive into Deep Learning, 3.1 Linear regression and 12.4 Stochastic gradient descent", url:"https://d2l.ai/chapter_linear-regression/linear-regression.html"},
  matrixcookbook: {title:"The Matrix Cookbook (matrix derivatives reference)", url:"https://www.math.uwaterloo.ca/~hwolkowi/matrixcookbook.pdf"},
  esl: {title:"The Elements of Statistical Learning, 3.4 Shrinkage methods (free PDF)", url:"https://hastie.su.domains/ElemStatLearn/"}
};

export const week3: Lesson[] = [
{
  id:"3-1", title:"Derivatives, gradients and the chain rule", mins:25,
  objectives:[
    "Read a derivative as a rate of change and as the best linear approximation",
    "Compute partial derivatives and the gradient of a function of many variables",
    "Explain why the gradient points uphill, so minus the gradient points downhill",
    "Apply the chain rule, including to vector expressions such as the squared error",
  ],
  prereqs:"<p>Week 1 (vectors and matrices). School algebra; you have seen \(y = mx + c\). No calculus is assumed.</p>",
  body:h`
<h3>1. Learning is minimising</h3>
<p>Training a model means choosing its parameters \(\theta\) to make a <b>loss</b> \(J(\theta)\) small. A model can have billions of parameters, so you cannot try them all. Calculus tells you, from where you stand, which direction makes the loss go down. That is all gradient descent needs, and it is how every neural network in this course is trained.</p>

<h3>2. The derivative</h3>
<p>For a function of one variable, the derivative is the rate of change:</p>
\[f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}.\]
<p>A more useful way to read it: near \(x\), the function is almost a straight line with slope \(f'(x)\),</p>
\[f(x + h) \approx f(x) + f'(x)\,h \quad \text{for small } h.\]
<p>If \(f'(x) > 0\), stepping right increases \(f\); if \(f'(x) < 0\), stepping right decreases it. At a minimum of a smooth function, \(f'(x) = 0\).</p>
<p>The rules you need: \((x^n)' = n x^{n-1}\), \((e^x)' = e^x\), \((\ln x)' = 1/x\), and sums and constant multiples carry through. Example: \(f(x) = (x - 3)^2 = x^2 - 6x + 9\) gives \(f'(x) = 2x - 6\), which is zero at \(x = 3\), the minimum.</p>

<h3>3. The chain rule</h3>
<p>If \(y = f(g(x))\), then</p>
\[\frac{dy}{dx} = f'(g(x))\,g'(x).\]
<p>Rates multiply along a chain: if \(g\) doubles small changes and \(f\) triples them, the composition multiplies them by six. Neural networks are long chains of simple functions, and <b>backpropagation</b> (Month 2) is nothing more than the chain rule applied carefully, from the loss back to each weight.</p>
<p>Example: \(\frac{d}{dx}(3x + 1)^2 = 2(3x + 1) \cdot 3\).</p>

<h3>4. Partial derivatives and the gradient</h3>
<p>A loss depends on many parameters, \(J(\theta_1, \dots, \theta_d)\). The <b>partial derivative</b> \(\partial J / \partial \theta_j\) is the ordinary derivative with respect to \(\theta_j\), holding all the others fixed. Collect them into a vector, the <b>gradient</b>:</p>
\[\nabla J(\theta) = \left(\frac{\partial J}{\partial \theta_1}, \dots, \frac{\partial J}{\partial \theta_d}\right).\]
<p>The one-variable approximation becomes a dot product:</p>
\[J(\theta + \Delta) \approx J(\theta) + \nabla J(\theta) \cdot \Delta.\]
<p><b>Why the gradient points uphill.</b> For a small step \(\Delta\) of fixed length, the change \(\nabla J \cdot \Delta = \|\nabla J\|\,\|\Delta\|\cos\phi\) (lesson 1.1) is largest when \(\Delta\) points the same way as \(\nabla J\) (\(\phi = 0\)) and most negative when it points the opposite way. So \(-\nabla J\) is the direction of <b>steepest descent</b>. Gradient descent just keeps stepping that way.</p>

<h3>5. Two vector derivatives you will use all week</h3>
<p>For a vector \(\theta \in \mathbb R^d\), a fixed vector \(a\) and a matrix \(A\):</p>
\[\nabla_\theta (a^\top \theta) = a, \qquad \nabla_\theta (\theta^\top A \theta) = (A + A^\top)\theta = 2A\theta \text{ if } A \text{ is symmetric}.\]
<p>These are the vector versions of \((ax)' = a\) and \((ax^2)' = 2ax\). With them and the chain rule, the gradient of the squared error is one line:</p>
\[J(\theta) = \tfrac12 \|X\theta - y\|^2 \quad\Longrightarrow\quad \nabla J(\theta) = X^\top (X\theta - y).\]
<p>Read it: the residuals \(r = X\theta - y\) (one per example) are sent back through \(X^\top\), so each parameter's gradient is the sum, over examples, of residual times that example's feature. You will derive it properly in the next lesson.</p>

<h3>6. Checking a gradient numerically</h3>
<p>The definition of the derivative gives a test for any gradient you compute by hand: nudge one parameter and watch the loss.</p>
\[\frac{\partial J}{\partial \theta_j} \approx \frac{J(\theta + \varepsilon e_j) - J(\theta - \varepsilon e_j)}{2\varepsilon}, \quad \varepsilon \approx 10^{-5}.\]
<p>This "centred difference" is accurate to about \(\varepsilon^2\). It is too slow for training (two loss evaluations per parameter) but perfect for testing. In Week 4 you will use it to prove your logistic-regression gradient is right.</p>

<h3>Summary</h3>
<ul>
<li>The derivative is the slope of the best straight-line approximation.</li>
<li>Chain rule: rates multiply along a composition. Backprop is the chain rule.</li>
<li>The gradient collects partial derivatives; \(-\nabla J\) is steepest descent.</li>
<li>\(\nabla \tfrac12\|X\theta - y\|^2 = X^\top(X\theta - y)\).</li>
<li>Check hand-derived gradients with centred differences.</li>
</ul>`,
  watch:[V.calculus, V.gradient],
  read:[R.mml, R.matrixcookbook],
  exercise:h`<p>Write <code>numgrad(f, theta, eps=1e-5)</code> that returns the centred-difference gradient of any function of a NumPy vector. Use it to check, at three random points, your hand-derived gradients of: (a) \(f(\theta) = \sum_j \theta_j^2\); (b) \(f(\theta) = a^\top\theta\); (c) \(f(\theta) = \tfrac12\|X\theta - y\|^2\) with a random \(X\) of shape (20, 3). Report the relative error \(\|g - \hat g\| / (\|g\| + \|\hat g\|)\); it should be below \(10^{-7}\).</p>`,
  problems:[
    {q:h`<p>Find the gradient of \(f(w_1, w_2) = w_1^2 + 3 w_1 w_2 + 2 w_2^2\) at \((1, -1)\). Which unit direction decreases \(f\) fastest?</p>`,
     a:h`<p>\(\partial f/\partial w_1 = 2w_1 + 3w_2 = -1\), \(\partial f/\partial w_2 = 3w_1 + 4w_2 = -1\). So \(\nabla f = (-1, -1)\). The fastest decrease is along \(-\nabla f / \|\nabla f\| = (1, 1)/\sqrt2\).</p>`},
    {q:h`<p>Differentiate \(L(w) = \ln(1 + e^{-w})\). What happens to \(L'(w)\) when \(w\) is very large and positive, and very negative?</p>`,
     a:h`<p>Chain rule: \(L'(w) = \frac{1}{1 + e^{-w}} \cdot (-e^{-w}) = -\frac{e^{-w}}{1 + e^{-w}} = -\frac{1}{1 + e^{w}}\). For large positive \(w\), \(L' \to 0\): the loss is already near zero and flat. For very negative \(w\), \(L' \to -1\): the loss grows linearly. This is the logistic loss of Week 4.</p>`},
    {q:h`<p>The centred difference has error about \(\varepsilon^2\), so why not take \(\varepsilon = 10^{-12}\)?</p>`,
     a:h`<p>Floating-point rounding. In float64, \(J(\theta \pm \varepsilon e_j)\) is only stored to about 16 significant digits; subtracting two nearly equal numbers and dividing by a tiny \(2\varepsilon\) magnifies that rounding error, roughly like \(10^{-16}/\varepsilon\). The two errors balance around \(\varepsilon \approx 10^{-5}\) to \(10^{-6}\). In float32, use something larger, around \(10^{-3}\).</p>`}
  ],
  quiz:[
    {q:"Which direction makes a loss decrease fastest, for a small step?", o:["The gradient","Minus the gradient","Any direction where one partial derivative is zero","The direction of the largest parameter"], a:1, why:"The change is grad · step, which is most negative when the step points opposite to the gradient."},
    {q:"Backpropagation is, mathematically:", o:["A new kind of derivative","The chain rule applied from the loss back to each parameter","Numerical differentiation","Random search"], a:1, why:"A network is a chain of functions; backprop multiplies local derivatives along it."},
    {q:"Why use the centred difference (f(x+e) - f(x-e)) / 2e to check gradients?", o:["It is exact","It is more accurate than the one-sided version (error about e squared, not e)","It is fast enough for training","It avoids the chain rule"], a:1, why:"The first-order errors cancel, leaving an error of order e squared."}
  ]
},
{
  id:"3-2", title:"Linear regression and the normal equations", mins:30,
  objectives:[
    "Set up linear regression with a design matrix and a bias column",
    "Derive the normal equations and solve them in NumPy",
    "Explain least squares as projecting y onto the column space of X",
    "Show that least squares is maximum likelihood with normal noise",
  ],
  prereqs:"<p>Lessons 1.2–1.3 (matrices, column space), 2.4 (maximum likelihood) and 3.1.</p>",
  body:h`
<h3>1. The model</h3>
<p>We have \(n\) examples. Example \(i\) has a feature vector \(x^{(i)} \in \mathbb R^d\) and a target \(y^{(i)} \in \mathbb R\). For instance: features = (floor area, bedrooms, distance to the Third Mainland Bridge), target = rent. Linear regression predicts</p>
\[h_\theta(x) = \theta_0 + \theta_1 x_1 + \dots + \theta_d x_d = \theta^\top x,\]
<p>where we add a constant feature \(x_0 = 1\) so that the bias \(\theta_0\) is just another weight. Stack the examples as rows of the <b>design matrix</b> \(X \in \mathbb R^{n \times (d+1)}\) and the targets into \(y \in \mathbb R^n\). All predictions at once are \(X\theta\).</p>

<h3>2. The loss</h3>
<p>Measure the fit with the <b>sum of squared errors</b> (CS229 Lecture 2):</p>
\[J(\theta) = \frac12 \sum_{i=1}^n \big(h_\theta(x^{(i)}) - y^{(i)}\big)^2 = \frac12 \|X\theta - y\|^2.\]
<p>Why squares? They are smooth (easy to differentiate), punish large errors more than small ones, and, as section 5 shows, they are what maximum likelihood gives under normal noise.</p>

<h3>3. The normal equations</h3>
<p>Expand: \(J(\theta) = \tfrac12(\theta^\top X^\top X \theta - 2 y^\top X \theta + y^\top y)\). Using the two vector derivatives from lesson 3.1 (\(X^\top X\) is symmetric):</p>
\[\nabla J(\theta) = X^\top X \theta - X^\top y = X^\top (X\theta - y).\]
<p>Set it to zero:</p>
\[X^\top X\,\theta = X^\top y \quad\Longrightarrow\quad \hat\theta = (X^\top X)^{-1} X^\top y.\]
<p>These are the <b>normal equations</b>. \(J\) is a bowl-shaped (convex) quadratic, so this stationary point is the global minimum. \(X^\top X\) is invertible exactly when the columns of \(X\) are linearly independent; if one feature is a copy of another (area in m² and area in ft²), it is not, and the answer is not unique.</p>
<p>In code, never form the inverse. Solve the system:</p>
<pre>theta = np.linalg.lstsq(X, y, rcond=None)[0]   # stable, handles rank deficiency
# or: np.linalg.solve(X.T @ X, X.T @ y)         # fine when X is well conditioned</pre>
<p>Cost: forming \(X^\top X\) is about \(n d^2\) operations and solving is about \(d^3\). For \(d\) in the thousands this is instant. For \(d\) in the millions (or a model that isn't linear) it is impossible, and you need gradient descent (lesson 3.3).</p>

<h3>4. The geometry: a projection</h3>
<p>\(X\theta\) is a linear combination of the columns of \(X\) (lesson 1.2), so every possible prediction vector lives in the <b>column space</b> of \(X\). Usually \(y\) is not in it; there is no exact fit. Least squares picks the point \(\hat y = X\hat\theta\) in that space <b>closest</b> to \(y\).</p>
<p>The normal equations say \(X^\top(y - X\hat\theta) = 0\): the residual \(r = y - \hat y\) is <b>orthogonal to every column</b> of \(X\). That is exactly the condition for \(\hat y\) to be the orthogonal projection of \(y\) onto the column space (Strang, Lectures 15–16). The projection matrix is \(P = X(X^\top X)^{-1}X^\top\), and \(\hat y = Py\).</p>
<p>A useful consequence: because the bias column is all ones, \(\mathbf 1^\top r = 0\), so least-squares residuals always average to zero.</p>

<h3>5. Least squares is maximum likelihood</h3>
<p>Assume the data were generated as \(y^{(i)} = \theta^\top x^{(i)} + \epsilon^{(i)}\), with independent noise \(\epsilon^{(i)} \sim \mathcal N(0, \sigma^2)\). The log-likelihood of the targets is</p>
\[\ell(\theta) = \sum_{i} \log \frac{1}{\sigma\sqrt{2\pi}} e^{-(y^{(i)} - \theta^\top x^{(i)})^2 / 2\sigma^2} = -\frac{1}{2\sigma^2}\sum_i (y^{(i)} - \theta^\top x^{(i)})^2 + \text{const}.\]
<p>Maximising \(\ell\) is minimising the sum of squared errors: the same \(\hat\theta\). Squared error is not arbitrary; it is the right loss when the noise is normal. When the noise has heavy tails (outliers, data-entry mistakes), squared error lets a few points drag the fit, and a loss like the absolute error, which corresponds to heavier-tailed (Laplace) noise, is more robust.</p>

<h3>6. Measuring the fit</h3>
<p>Report the <b>root mean squared error</b> \(\text{RMSE} = \sqrt{\tfrac1n\|X\hat\theta - y\|^2}\), in the units of \(y\) ("off by ₦38,000 a month on average"), and \(R^2 = 1 - \frac{\sum r_i^2}{\sum (y_i - \bar y)^2}\), the fraction of the variance explained. Always report them on data the model did not see; lesson 3.4 explains why.</p>

<h3>Summary</h3>
<ul>
<li>Add a column of ones; predictions are \(X\theta\).</li>
<li>Normal equations: \(X^\top X\theta = X^\top y\). Solve, don't invert.</li>
<li>Geometry: \(\hat y\) is the projection of \(y\) onto the column space; residuals are orthogonal to the features.</li>
<li>Squared error = maximum likelihood with normal noise.</li>
</ul>`,
  watch:[V.lsq, V.proj],
  read:[R.cs229notes, R.d2l],
  exercise:h`<p>Generate 200 points with \(y = 4 + 3x_1 - 2x_2 + \epsilon\), \(\epsilon \sim \mathcal N(0, 1)\). Fit \(\theta\) with <code>np.linalg.lstsq</code> and with <code>np.linalg.solve</code> on the normal equations; check they agree and are close to (4, 3, −2). Verify numerically that \(X^\top r \approx 0\) and that the residuals average to zero. Then add a third feature equal to \(2x_1\) and see what each method does.</p>`,
  problems:[
    {q:h`<p>Fit \(y = \theta_0 + \theta_1 x\) by least squares to the points \((0, 1), (1, 3), (2, 4)\).</p>`,
     a:h`<p>\(X = \begin{pmatrix}1&0\\1&1\\1&2\end{pmatrix}\), \(y = (1, 3, 4)\). \(X^\top X = \begin{pmatrix}3&3\\3&5\end{pmatrix}\), \(X^\top y = (8, 11)\). Solve: \(3\theta_0 + 3\theta_1 = 8\), \(3\theta_0 + 5\theta_1 = 11\). Subtracting, \(2\theta_1 = 3\), so \(\theta_1 = 1.5\) and \(\theta_0 = (8 - 4.5)/3 = 7/6 \approx 1.167\). Residuals: \(1 - 1.167 = -0.167\), \(3 - 2.667 = 0.333\), \(4 - 4.167 = -0.167\). They sum to zero, as promised.</p>`},
    {q:h`<p>Show that with only a bias column (no features), least squares predicts the mean of \(y\).</p>`,
     a:h`<p>\(X = \mathbf 1\), so \(X^\top X = n\) and \(X^\top y = \sum y_i\). The normal equation gives \(\theta_0 = \frac1n\sum y_i = \bar y\). This is also the maximum-likelihood normal mean from lesson 2.4.</p>`},
    {q:h`<p>Show that the projection matrix \(P = X(X^\top X)^{-1}X^\top\) satisfies \(P^2 = P\). What does that mean geometrically?</p>`,
     a:h`<p>\(P^2 = X(X^\top X)^{-1}(X^\top X)(X^\top X)^{-1}X^\top = X(X^\top X)^{-1}X^\top = P\). Projecting a second time does nothing: a vector already in the column space is its own closest point there.</p>`}
  ],
  quiz:[
    {q:"The normal equations for least squares are:", o:["X theta = y","X^T X theta = X^T y","theta = X y","X X^T theta = y"], a:1, why:"Setting the gradient X^T(X theta - y) to zero gives X^T X theta = X^T y."},
    {q:"Geometrically, the least-squares residual vector is:", o:["Parallel to y","Orthogonal to every column of X","Always zero","Equal to the prediction"], a:1, why:"X^T r = 0 means r is perpendicular to the column space, so X theta-hat is the projection of y."},
    {q:"Squared error is the maximum-likelihood loss when the noise is:", o:["Uniform","Normal","Poisson","Absent"], a:1, why:"The Gaussian log-density is minus the squared error over 2 sigma squared, plus a constant."}
  ]
},
{
  id:"3-3", title:"Gradient descent: batch, stochastic and mini-batch", mins:30,
  objectives:[
    "Implement batch gradient descent for linear regression",
    "Choose a learning rate, and explain divergence and slow convergence with the curvature of the loss",
    "Explain why feature scaling speeds training up",
    "Implement stochastic and mini-batch gradient descent and compare the cost per step with the noise",
  ],
  prereqs:"<p>Lessons 3.1–3.2.</p>",
  body:h`
<h3>1. The algorithm</h3>
<p>Start from any \(\theta\) (zeros, or small random numbers) and repeat:</p>
\[\theta \leftarrow \theta - \eta\,\nabla J(\theta).\]
<p>\(\eta > 0\) is the <b>learning rate</b> (step size). For linear regression with the mean squared error \(J(\theta) = \frac{1}{2n}\|X\theta - y\|^2\):</p>
\[\nabla J(\theta) = \frac1n X^\top (X\theta - y).\]
<pre>for step in range(steps):
    grad = X.T @ (X @ theta - y) / n
    theta -= lr * grad</pre>
<p>We divide by \(n\) (use the mean, not the sum) so that the learning rate doesn't have to change when the dataset grows. This is <b>batch</b> gradient descent: every step looks at all \(n\) examples. For linear regression it reaches the same answer as the normal equations; for neural networks there are no normal equations, and gradient descent is the only option.</p>

<h3>2. The learning rate</h3>
<p>Too small and training crawls. Too large and each step overshoots the bottom of the valley, lands higher on the other side, and the loss <b>diverges</b> to infinity. You can see the exact threshold for a quadratic.</p>
<p>Take one dimension, \(J(\theta) = \frac{a}{2}\theta^2\) with curvature \(a > 0\). Then \(\theta \leftarrow \theta - \eta a\theta = (1 - \eta a)\theta\). This shrinks towards 0 when \(|1 - \eta a| < 1\), that is \(0 < \eta < 2/a\). It is fastest at \(\eta = 1/a\) (one step). Above \(2/a\) it oscillates with growing size.</p>
<p>In many dimensions, the curvature of \(J\) is described by the matrix \(H = \frac1n X^\top X\) (its <b>Hessian</b>), and each eigen-direction of \(H\) behaves like the one-dimensional case with \(a = \) that eigenvalue. So:</p>
<ul>
<li>Stability needs \(\eta < 2/\lambda_{\max}\), set by the steepest direction.</li>
<li>Progress along the flattest direction is then about \(\eta\lambda_{\min} < 2\lambda_{\min}/\lambda_{\max}\) per step.</li>
</ul>
<p>The ratio \(\kappa = \lambda_{\max}/\lambda_{\min}\) is the <b>condition number</b>. When it is large, the loss is a long narrow valley: you must take small steps to avoid bouncing off the steep walls, and then you crawl along the floor.</p>

<h3>3. Feature scaling</h3>
<p>Features on very different scales (age in years, income in naira) make \(\kappa\) enormous. The fix is to <b>standardise</b> each feature: subtract its mean and divide by its standard deviation, using statistics from the training set only. This makes the valley rounder and often turns thousands of steps into tens. Neural networks do the same thing inside the model with normalisation layers (Month 2).</p>

<h3>4. Stochastic gradient descent</h3>
<p>The full gradient is an average over all examples: \(\nabla J = \frac1n\sum_i \nabla J_i\). With a billion examples, one step costs a billion gradient evaluations. <b>Stochastic gradient descent</b> (SGD) uses one random example per step:</p>
\[\theta \leftarrow \theta - \eta\,\nabla J_i(\theta), \qquad i \text{ chosen at random}.\]
<p>Because \(i\) is uniform, \(E[\nabla J_i] = \nabla J\) (linearity of expectation, lesson 2.3): each step is right <b>on average</b>, but noisy. In practice, you use <b>mini-batches</b> of \(B\) examples (32 to a few thousand), which averages the noise down: the variance of the estimate falls like \(1/B\) (lesson 2.3 again), and a GPU processes a batch nearly as fast as one example.</p>
<p>Words you will see: one pass through the shuffled data is an <b>epoch</b>. Reshuffle every epoch.</p>

<h3>5. The noise has consequences</h3>
<ul>
<li>With a constant learning rate, SGD doesn't settle exactly at the minimum; it jitters around it in a region whose size grows with \(\eta\) and shrinks with \(B\). So learning rates are <b>decayed</b> over training (step decay, cosine schedules, warm-up then decay; Month 2).</li>
<li>The total work to reach a given loss is usually far less than batch descent, because early on even a noisy direction is a good direction.</li>
<li>For non-convex losses (neural networks), the noise helps escape poor flat regions.</li>
</ul>
<p>Adam, the optimiser you will use most, is SGD with a per-parameter step size and momentum; it is built on exactly these ideas.</p>

<h3>Summary</h3>
<ul>
<li>\(\theta \leftarrow \theta - \eta\nabla J(\theta)\); use the mean loss so \(\eta\) doesn't depend on \(n\).</li>
<li>Stable for \(\eta < 2/\lambda_{\max}\); slow when the condition number is large.</li>
<li>Standardise features with training-set statistics.</li>
<li>SGD and mini-batches: unbiased, noisy, far cheaper per step. Decay the learning rate.</li>
</ul>`,
  watch:[U.gd3b1b, V.gdstep, V.sgd],
  read:[R.cs229notes, R.d2l],
  exercise:h`<p>On the data from lesson 3.2, run batch gradient descent with learning rates 0.001, 0.01, 0.1, 0.5 and 1.0 for 500 steps and plot the loss against steps (log scale). Find the largest stable rate, compute \(2/\lambda_{\max}\) of \(\frac1n X^\top X\) with <code>np.linalg.eigvalsh</code>, and compare. Then multiply one feature by 1,000 and repeat, before and after standardising.</p>`,
  problems:[
    {q:h`<p>\(J(\theta) = \frac12(10\theta_1^2 + \theta_2^2)\). What is the largest stable learning rate? With \(\eta = 0.15\), by what factor does each coordinate shrink per step?</p>`,
     a:h`<p>Curvatures are 10 and 1, so stability needs \(\eta < 2/10 = 0.2\). With \(\eta = 0.15\): \(\theta_1 \leftarrow (1 - 1.5)\theta_1 = -0.5\theta_1\) (it flips sign and halves each step) and \(\theta_2 \leftarrow 0.85\theta_2\). The flat direction is the slow one: after 20 steps \(\theta_2\) has only shrunk to \(0.85^{20} \approx 0.04\) of its start.</p>`},
    {q:h`<p>Show that the mini-batch gradient \(g_B = \frac1B\sum_{i \in \mathcal B}\nabla J_i\), with \(\mathcal B\) a uniformly random batch drawn with replacement, satisfies \(E[g_B] = \nabla J\).</p>`,
     a:h`<p>Each draw \(i\) is uniform on \(1..n\), so \(E[\nabla J_i] = \frac1n\sum_{k=1}^n \nabla J_k = \nabla J\). By linearity, \(E[g_B] = \frac1B\sum_{b=1}^{B} E[\nabla J_{i_b}] = \frac1B \cdot B\,\nabla J = \nabla J\). Its variance, for independent draws, is the single-example variance divided by \(B\).</p>`},
    {q:h`<p>You standardise features using the mean and standard deviation of the whole dataset, then split into training and test sets. What is wrong?</p>`,
     a:h`<p>Information from the test set has leaked into training through the scaling statistics, so the test score is slightly optimistic. Compute the statistics on the training set only, and apply those same numbers to the validation and test sets (and in production). Scikit-learn's <code>Pipeline</code> does this for you.</p>`}
  ],
  quiz:[
    {q:"Your training loss shoots up to infinity after a few steps. The most likely fix is:", o:["Train for longer","Lower the learning rate","Add more features","Remove the bias"], a:1, why:"Divergence means steps overshoot: eta is above 2 / (largest curvature)."},
    {q:"Why does SGD work even though each step uses one example?", o:["The examples are all identical","Its gradient is correct on average (unbiased), so the noise averages out over steps","It computes the exact gradient","It doesn't, it only works for convex losses"], a:1, why:"E[grad J_i] = grad J by linearity; mini-batches reduce the variance by a factor of B."},
    {q:"Standardising features mainly helps gradient descent by:", o:["Changing the optimal predictions","Reducing the condition number, so the loss valley is rounder","Removing the need for a learning rate","Making the loss convex"], a:1, why:"Similar scales give similar curvatures, so one learning rate suits every direction."}
  ]
},
{
  id:"3-4", title:"Generalisation, overfitting and regularisation", mins:30,
  objectives:[
    "Split data into training, validation and test sets, and say what each is for",
    "Recognise underfitting and overfitting from training and validation error",
    "Derive ridge regression and explain how it trades bias for variance",
    "Build the Week 3 project: normal equations vs batch GD vs SGD",
  ],
  prereqs:"<p>Lessons 3.1–3.3.</p>",
  body:h`
<h3>1. The goal is new data</h3>
<p>A model that memorises its training data is useless. What matters is the error on data it has never seen: the <b>generalisation error</b>. You can't measure that on the training set, because the model was fitted to it, so you hold data back:</p>
<ul>
<li><b>Training set</b> (say 70%): fit the parameters.</li>
<li><b>Validation set</b> (15%): choose between models and settings (features, polynomial degree, \(\lambda\), learning rate).</li>
<li><b>Test set</b> (15%): look at it <b>once</b>, at the end, to report the result.</li>
</ul>
<p>If you tune against the test set, it becomes a second validation set and its score is no longer honest. Split by the unit you will generalise across: if the same patient has five visits, all five go in the same split, or you are testing on people the model already knows.</p>

<h3>2. Underfitting and overfitting</h3>
<p>Fit polynomials of degree 1, 3 and 15 to 20 noisy points from a curve. Degree 1 can't bend: high training error and high validation error (<b>underfitting</b>, high <b>bias</b>). Degree 15 passes through every point, including the noise: near-zero training error but wild between points, so high validation error (<b>overfitting</b>, high <b>variance</b>). Degree 3 is in between and wins on validation.</p>
<p>The diagnostic is the gap. Training error high: the model is too simple or under-trained. Training error low but validation error much higher: overfitting; get more data, simplify, or regularise.</p>

<h3>3. The bias–variance decomposition</h3>
<p>For squared error, suppose \(y = f(x) + \epsilon\) with noise variance \(\sigma^2\), and \(\hat f\) is fitted on a random training set. At a point \(x\), averaging over training sets and noise,</p>
\[E\big[(y - \hat f(x))^2\big] = \underbrace{\big(f(x) - E[\hat f(x)]\big)^2}_{\text{bias}^2} + \underbrace{\operatorname{Var}\big(\hat f(x)\big)}_{\text{variance}} + \underbrace{\sigma^2}_{\text{noise}}.\]
<p>Simple models have high bias and low variance; flexible models the reverse. The noise term is a floor no model can beat. (Very large neural networks complicate this picture, a phenomenon called double descent, but for the models this week it is the right mental model.)</p>

<h3>4. Ridge regression</h3>
<p>One way to tame variance is to penalise large weights. <b>Ridge regression</b> (L2 regularisation) minimises</p>
\[J_\lambda(\theta) = \frac12\|X\theta - y\|^2 + \frac{\lambda}{2}\|\theta\|^2.\]
<p>The gradient is \(X^\top(X\theta - y) + \lambda\theta\); setting it to zero gives</p>
\[\hat\theta_\lambda = (X^\top X + \lambda I)^{-1} X^\top y.\]
<p>Three things to notice:</p>
<ul>
<li>Adding \(\lambda I\) makes the matrix invertible even when features are duplicated, so ridge also fixes the problem from lesson 3.2.</li>
<li>Its eigenvalues are at least \(\lambda\), so the condition number falls and gradient descent converges faster.</li>
<li>In gradient descent, the penalty adds \(-\eta\lambda\theta\) to every step, shrinking weights towards zero: this is <b>weight decay</b>, used in training almost every large model.</li>
</ul>
<p>Don't penalise the bias \(\theta_0\) (it just sets the average level), and standardise features first, because the penalty treats all weights alike. Choose \(\lambda\) on the validation set, trying values on a log scale (\(10^{-4}, 10^{-3}, \dots, 10^{2}\)).</p>
<p><b>Lasso</b> (L1, \(\lambda\sum|\theta_j|\)) pushes some weights exactly to zero, so it also selects features. It has no closed form but is easy to fit.</p>

<h3>5. Regularisation as a prior</h3>
<p>From lesson 2.2's Bayes view: if you believe, before seeing data, that each \(\theta_j \sim \mathcal N(0, \tau^2)\), then the most probable \(\theta\) after seeing the data (the <b>MAP</b> estimate) is exactly ridge regression with \(\lambda = \sigma^2/\tau^2\). A penalty is a prior belief that weights are small.</p>

<h3>Summary</h3>
<ul>
<li>Train to fit, validate to choose, test once to report. Split by patient, user or document.</li>
<li>High training error: underfit. Big train–validation gap: overfit.</li>
<li>Expected error = bias² + variance + noise.</li>
<li>Ridge: \((X^\top X + \lambda I)^{-1}X^\top y\); in GD it is weight decay. Choose \(\lambda\) on validation.</li>
</ul>`,
  watch:[V.ridge, V.ridgelasso],
  read:[R.esl, R.cs229notes],
  exercise:h`<p><b>Week 3 build: normal equations vs batch GD vs SGD.</b> Use a real regression dataset (scikit-learn's California housing, or rents scraped from a listings site you are allowed to use). Standardise using training statistics, and split 70/15/15. Fit linear regression three ways from scratch: the normal equations, batch gradient descent and mini-batch SGD (\(B = 64\), with a decaying learning rate). For each, report validation RMSE, wall-clock time and the number of passes over the data, and plot validation loss against time on one chart. Then add polynomial features of degree 2, fit ridge for \(\lambda \in \{10^{-4}, \dots, 10^{2}\}\), and plot training and validation RMSE against \(\lambda\). Report the test RMSE once, for your chosen model. Publish the notebook and a short write-up of when you would use each method.</p>`,
  problems:[
    {q:h`<p>For one feature with no bias, ridge gives \(\hat\theta = \frac{\sum x_i y_i}{\sum x_i^2 + \lambda}\). What happens as \(\lambda \to 0\) and \(\lambda \to \infty\)?</p>`,
     a:h`<p>As \(\lambda \to 0\) it becomes ordinary least squares, \(\sum x_i y_i / \sum x_i^2\). As \(\lambda \to \infty\), \(\hat\theta \to 0\): the model ignores the data and predicts zero. Bias rises and variance falls as \(\lambda\) grows; the validation set finds the balance.</p>`},
    {q:h`<p>Show that one gradient descent step on the ridge loss is \(\theta \leftarrow (1 - \eta\lambda)\theta - \eta X^\top(X\theta - y)\). Why is it called weight decay?</p>`,
     a:h`<p>\(\nabla J_\lambda = X^\top(X\theta - y) + \lambda\theta\), so \(\theta - \eta\nabla J_\lambda = \theta - \eta\lambda\theta - \eta X^\top(X\theta - y) = (1 - \eta\lambda)\theta - \eta X^\top(X\theta - y)\). Before each ordinary step, every weight is multiplied by \(1 - \eta\lambda\), a little below 1: the weights decay unless the data keeps pushing them up.</p>`},
    {q:h`<p>A model has training RMSE 2.1 and validation RMSE 2.3. Another has training RMSE 0.4 and validation RMSE 3.8. Diagnose each and suggest one next step.</p>`,
     a:h`<p>The first has a small gap, so it is not overfitting; if 2.1 is not good enough it is underfitting: add features, a more flexible model, or train longer. The second has a huge gap: it is overfitting; add regularisation, reduce flexibility, or get more data. Choose the first unless the second can be regularised to beat 2.3 on validation.</p>`}
  ],
  quiz:[
    {q:"What is the test set for?", o:["Choosing the learning rate","Choosing lambda","Reporting the final result once, after all choices are made","Training the bias"], a:2, why:"Tuning on the test set makes its score optimistic. Choices are made on the validation set."},
    {q:"Training error is very low and validation error is much higher. This is:", o:["Underfitting","Overfitting (high variance)","Irreducible noise","A learning-rate problem"], a:1, why:"The model fits noise in the training set that doesn't repeat in new data."},
    {q:"Adding lambda I to X^T X in ridge regression:", o:["Always increases validation error","Makes the system invertible and shrinks the weights","Removes the need to standardise","Is the same as adding more data points with y = 1"], a:1, why:"Eigenvalues become at least lambda, so the matrix is invertible and the solution is pulled towards zero."}
  ]
}
];
