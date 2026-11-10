import type { Month } from "../types";

// AI engineer track: outline. Each week is built around one university lecture (see engineer/index.ts and ../unis.ts).
export const E_LINKS: Record<string, [string, string]> = {
  ocw1806:["MIT 18.06 Linear Algebra (OpenCourseWare)","https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"],
  stat110:["Harvard Stat 110 (course site)","https://stat110.net"],
  cs229:["Stanford CS229 Machine Learning","https://cs229.stanford.edu"],
  mit191:["MIT 6.S191 Introduction to Deep Learning","https://introtodeeplearning.com"],
  zth:["Neural Networks: Zero to Hero (Karpathy)","https://karpathy.ai/zero-to-hero.html"],
  cs336:["Stanford CS336 Language Modeling from Scratch","https://stanford-cs336.github.io"],
  cs224n:["Stanford CS224N NLP with Deep Learning","https://web.stanford.edu/class/cs224n/"],
  d2l:["Dive into Deep Learning (free textbook)","https://d2l.ai"],
  peft:["Hugging Face PEFT docs","https://huggingface.co/docs/peft"],
  evals:["Hamel Husain on evals","https://hamel.dev"],
  agents:["Building effective agents (Anthropic)","https://www.anthropic.com/research/building-effective-agents"],
  efficientml:["MIT 6.5940 EfficientML","https://hanlab.mit.edu/courses/2023-fall-65940"],
  mlops:["MLOps: continuous delivery and automation pipelines (Google Cloud)","https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning"],
  madewithml:["Made With ML (free MLOps course)","https://madewithml.com"]
};

export const E_MONTHS: Month[] = [
 {t:"Mathematics for machine learning", k:"Maths", s:"Linear algebra, probability and optimisation: the three languages every model is written in.", reads:["ocw1806","stat110","cs229"],
  exam:"Implement linear and logistic regression from scratch in NumPy (no ML libraries), derive both gradients on paper, and show your gradient matches a numerical check to 6 decimal places.",
  weeks:[
   ["Linear algebra: vectors, matrices and the geometry of data","Implement matrix-vector multiply, dot-product similarity and a nearest-neighbour search over 1,000 vectors, in plain Python and then NumPy.",
    ["Watch MIT 18.06 Lecture 1 and work the row and column pictures","Work the problem set in the lecture notes","Implement cosine similarity and nearest-neighbour search","Time plain Python against NumPy and explain the difference"]],
   ["Probability: the language of uncertainty","Simulate a diagnostic test and verify Bayes' rule numerically against your formula.",
    ["Watch Harvard Stat 110 Lecture 1","Work expectation, variance and Bayes problems by hand","Simulate 100,000 trials and compare with theory","Explain base-rate errors with your own medical-test example"]],
   ["Learning as optimisation: regression and gradient descent","Fit linear regression three ways: normal equations, batch gradient descent and stochastic gradient descent.",
    ["Watch Stanford CS229 Lecture 2","Derive the least-squares gradient by hand","Implement all three solvers and plot loss curves","Show what too large a learning rate does"]],
   ["Exam week: classification and logistic regression","Ship the month-one exam: regression and classification from scratch, with a gradient check.",
    ["Watch Stanford CS229 Lecture 3","Derive the cross-entropy gradient","Implement logistic regression with a numerical gradient check","Write up results with plots and a one-page derivation"]]
  ]},
 {t:"Deep learning from first principles", k:"Deep learning", s:"Neurons, backpropagation, and training networks that actually converge.", reads:["mit191","zth","d2l"],
  exam:"A small autograd engine written from scratch, used to train a multi-layer network to over 95% test accuracy on a real dataset, with a write-up of every training decision.",
  weeks:[
   ["Neural networks","Train a two-layer network in NumPy on a toy non-linear dataset that logistic regression can't solve.",
    ["Watch MIT 6.S191 Lecture 1","Explain why stacking linear layers without activations is still linear","Implement a forward pass by hand","Train it and plot the decision boundary"]],
   ["Backpropagation and automatic differentiation","Build micrograd: a scalar autograd engine in about 150 lines.",
    ["Watch Karpathy's micrograd lecture and 3Blue1Brown's backprop calculus","Derive the chain rule for a three-node graph on paper","Build the engine and check gradients numerically","Train a small MLP with it"]],
   ["Training in practice","Move to PyTorch and make a network train reliably: initialisation, normalisation, optimisers, learning-rate schedules.",
    ["Watch Stanford CS336 Lecture 2","Count the FLOPs and memory of a model before you run it","Compare SGD, momentum and Adam on the same task","Diagnose a network that won't train, from its loss curve","Track every training run in MLflow (parameters, metrics, model file)"]],
   ["Exam week: train it properly","Ship the month-two exam.",
    ["Train a network on a real dataset to over 95% test accuracy","Hold out a test set you touch only once","Log every experiment in MLflow","Write up what mattered and what didn't"]]
  ]},
 {t:"Language models and transformers", k:"Transformers", s:"Tokenization, attention, and building a GPT yourself.", reads:["cs336","cs224n","zth"],
  exam:"A GPT you wrote yourself, with your own BPE tokenizer, trained on a corpus you chose (Nigerian Pidgin or Yoruba text is a good one), with loss curves and samples.",
  weeks:[
   ["Tokenization and language modelling","Write a byte-pair-encoding tokenizer and a bigram language model.",
    ["Watch Stanford CS336 Lecture 1","Implement BPE training and encoding","Measure tokens per word for English vs a Nigerian language","Train a bigram model and sample from it"]],
   ["Attention and the transformer","Implement scaled dot-product attention and multi-head attention, and test them against PyTorch's version.",
    ["Watch Stanford CS224N Lecture 8 (self-attention and transformers)","Derive why we scale by the square root of the key dimension","Implement causal masking","Check your output matches the library to 1e-5"]],
   ["Build a GPT","Assemble a decoder-only transformer and train it on a small corpus.",
    ["Watch Karpathy's \"Let's build GPT\"","Add residual connections, layer norm and an MLP block","Count parameters and estimate training FLOPs","Watch Stanford CS336 Lecture 3 on architecture choices"]],
   ["Exam week: your own GPT","Ship the month-three exam.",
    ["Train your GPT end to end with your own tokenizer","Plot train and validation loss","Show samples at three temperatures","Write up what scaling the model did"]]
  ]},
 {t:"Post-training and adaptation", k:"Post-training", s:"From a base model to a useful one: instruction tuning, preference learning, LoRA and quantisation.", reads:["cs224n","cs336","peft","efficientml"],
  exam:"Fine-tune an open model with LoRA on a task from your own work, and prove with an eval set of 100+ cases that it beats the base model and a prompted baseline.",
  weeks:[
   ["Instruction tuning and RLHF","Turn a base model's continuations into answers with a small supervised fine-tuning run.",
    ["Watch Stanford CS224N Spring 2024 Lecture 10 (post-training)","Explain the SFT, reward-model and RL stages","Build a 200-example instruction dataset","Run SFT on a small model and compare before and after"]],
   ["Preference learning: from RLHF to DPO","Train with preference pairs and see what changes.",
    ["Watch Stanford CS336 Lecture 15 (alignment)","Derive the DPO loss from the RLHF objective","Collect 100 preference pairs","Run DPO and compare with SFT alone"]],
   ["LoRA and quantisation","Fine-tune a 7–8B model on one consumer GPU.",
    ["Watch MIT 6.5940 Lecture 5 (quantisation)","Derive LoRA's parameter count for a given rank","Fine-tune with QLoRA","Measure memory, speed and quality at 16, 8 and 4 bits"]],
   ["Exam week: fine-tune and prove it","Ship the month-four exam.",
    ["Pick a real task and build a 100+ case eval set first","Compare base, prompted and fine-tuned models","Report accuracy, cost and latency","Publish the model card and the write-up","Register the model with its data version and eval results (you'll take it to production in Week 21)"]]
  ]},
 {t:"Evaluation and retrieval", k:"Evals & RAG", s:"Measure what a model can do, then give it the knowledge it lacks.", reads:["evals","cs224n","cs336"],
  exam:"A retrieval-augmented system over a real document set (clinical guidelines are a good choice), with retrieval and answer accuracy measured separately on 100+ questions.",
  weeks:[
   ["Evaluation","Build an eval harness that runs any model against a dataset and reports accuracy with confidence intervals.",
    ["Watch Stanford CS224N Spring 2024 Lecture 11 (benchmarking)","Compute a confidence interval for an accuracy score","Write rubric and model-as-judge scorers and check them against human labels","Find a case where a benchmark score misleads"]],
   ["Embeddings and vector search","Build semantic search from scratch, then with a vector database.",
    ["Watch Stanford CS224N Spring 2024 Lecture 2 (word vectors)","Explain contrastive training of embedding models","Implement exact and approximate nearest-neighbour search","Measure recall@k for both"]],
   ["Retrieval-augmented generation","Build RAG over 500+ real documents.",
    ["Watch Stanford CS25 (retrieval-augmented language models)","Test chunk sizes and overlap","Add hybrid search and reranking","Measure retrieval and generation accuracy separately"]],
   ["Exam week: measured RAG","Ship the month-five exam.",
    ["Build the system end to end","Write 100+ questions with sourced answers","Report retrieval recall, answer accuracy and citation accuracy","Publish failure cases and fixes"]]
  ]},
 {t:"MLOps, agents and production AI", k:"MLOps & production", s:"MLOps end to end, then agents, inference efficiency, and systems that run unattended.", reads:["mlops","madewithml","agents","cs336"],
  exam:"Capstone: a production AI system with real users (the ClinicVox triage service is a good candidate), run through your MLOps pipeline: versioned data, tracked experiments, a registered model, evals in CI, cost and latency dashboards, drift monitoring, and two weeks of measured live performance.",
  weeks:[
   ["MLOps: the life of a model in production","Take your Month 4 model through a full MLOps pipeline: versioned data, tracked experiments, a registered model, a served API with CI/CD, and a drift alert.",
    ["Version your dataset with DVC and write its datasheet","Track runs in MLflow and register the best model with a model card","Serve it behind an API with CI gates and a canary","Monitor drift with PSI and wire one alert with an owner"]],
   ["Agents and inference","Write a tool-using agent loop, evaluate it, then serve an open model fast and cheap.",
    ["Watch Stanford CS224N Spring 2024 Lecture 14 (reasoning and agents)","Implement the tool-call loop and measure success rate on 30 tasks","Watch Stanford CS336 Lecture 10 (inference) and compute KV-cache memory","Benchmark throughput with batching and pick the cheapest setup that meets a latency target"]],
   ["Production: monitoring, safety and cost","Put an AI feature behind evals in CI, tracing, and spend limits.",
    ["Watch the Berkeley CS294 LLM agents overview","Run your eval set on every pull request","Trace every model call with cost and latency","Red-team it for prompt injection"]],
   ["Capstone","Ship it, run it for two weeks, measure everything.",
    ["Deploy with monitoring from day one","Track accuracy, cost, latency and human interventions","Fix the top three failure modes","Give a public demo and publish the final write-up"]]
  ]}
];
