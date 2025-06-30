const barsContainer = document.getElementById("bars");
const speedSlider = document.getElementById("speed");
const sortBtn = document.getElementById("sort");
const pauseBtn = document.getElementById("pause");
const algorithmSelect = document.getElementById("algorithm");
const arraySizeInput = document.getElementById("array-size");
const customArrayInput = document.getElementById("custom-array");
const setArrayBtn = document.getElementById("set-array");

const comparisonsText = document.getElementById("comparisons");
const swapsText = document.getElementById("swaps");
const timeText = document.getElementById("time");
const complexityText = document.getElementById("complexity");
const algoTitle = document.getElementById("algo-title");
const algoDesc = document.getElementById("algo-description");

let array = [], bars = [];
let comparisons = 0, swaps = 0, paused = false;

function generateArray(size) {
  array = Array.from({ length: size }, () => Math.floor(Math.random() * 300 + 20));
  renderBars();
  comparisons = swaps = 0;
  comparisonsText.textContent = "0";
  swapsText.textContent = "0";
  timeText.textContent = "0.0s";
}

function renderBars() {
  barsContainer.innerHTML = "";
  bars = array.map(height => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = height + "px";
    bar.style.width = 100 / array.length + "%";
    barsContainer.appendChild(bar);
    return bar;
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateStats() {
  comparisonsText.textContent = comparisons;
  swapsText.textContent = swaps;
}

function setComplexity(algo) {
  const complexities = {
    "Bubble Sort": "O(n²)",
    "Selection Sort": "O(n²)",
    "Insertion Sort": "O(n²)",
    "Merge Sort": "O(n log n)",
    "Quick Sort": "O(n log n)",
    "Heap Sort": "O(n log n)",
    "Shell Sort": "O(n log n)",
    "Radix Sort": "O(nk)"
  };
  complexityText.innerHTML = complexities[algo];
}

function setDescription(algo) {
  const descriptions = {
    "Bubble Sort": "Bubble Sort compares adjacent elements and swaps them if they are in the wrong order.",
    "Selection Sort": "Selection Sort selects the smallest element and swaps it to the beginning of the unsorted section.",
    "Insertion Sort": "Insertion Sort places each element at its correct position by comparing backwards.",
    "Merge Sort": "Merge Sort divides, sorts, and merges the array recursively.",
    "Quick Sort": "Quick Sort picks a pivot and partitions the array around it.",
    "Heap Sort": "Heap Sort uses a heap to repeatedly extract the max and build sorted array.",
    "Shell Sort": "Shell Sort uses a gap to compare distant elements and reduce the gap.",
    "Radix Sort": "Radix Sort sorts integers by processing individual digits from least to most significant."
  };
  algoTitle.textContent = `How does ${algo} work?`;
  algoDesc.textContent = descriptions[algo];
}

algorithmSelect.onchange = () => {
  setComplexity(algorithmSelect.value);
  setDescription(algorithmSelect.value);
};

sortBtn.onclick = async () => {
  const algorithm = algorithmSelect.value;
  comparisons = swaps = 0;
  const start = performance.now();
  await sortAlgorithms[algorithm]();
  const end = performance.now();
  timeText.textContent = ((end - start) / 1000).toFixed(2) + "s";
};

pauseBtn.onclick = () => paused = !paused;
async function waitWhilePaused() { while (paused) await sleep(100); }

const sortAlgorithms = {
  "Bubble Sort": async () => {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        await waitWhilePaused();
        comparisons++;
        if (array[j] > array[j + 1]) {
          swaps++;
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          renderBars();
          await sleep(speedSlider.value);
        }
        updateStats();
      }
    }
  },

  "Selection Sort": async () => {
    for (let i = 0; i < array.length; i++) {
      let min = i;
      for (let j = i + 1; j < array.length; j++) {
        await waitWhilePaused();
        comparisons++;
        if (array[j] < array[min]) min = j;
        updateStats();
      }
      if (min !== i) {
        swaps++;
        [array[i], array[min]] = [array[min], array[i]];
        renderBars();
        await sleep(speedSlider.value);
        updateStats();
      }
    }
  },

  "Insertion Sort": async () => {
    for (let i = 1; i < array.length; i++) {
      let key = array[i], j = i - 1;
      while (j >= 0 && array[j] > key) {
        await waitWhilePaused();
        comparisons++;
        array[j + 1] = array[j];
        j--;
        swaps++;
        renderBars();
        await sleep(speedSlider.value);
        updateStats();
      }
      array[j + 1] = key;
      renderBars();
    }
  },

  "Merge Sort": async () => {
    async function mergeSort(arr, l, r) {
      if (l >= r) return;
      let m = l + Math.floor((r - l) / 2);
      await mergeSort(arr, l, m);
      await mergeSort(arr, m + 1, r);
      await merge(arr, l, m, r);
    }

    async function merge(arr, l, m, r) {
      let left = arr.slice(l, m + 1), right = arr.slice(m + 1, r + 1);
      let i = 0, j = 0, k = l;
      while (i < left.length && j < right.length) {
        await waitWhilePaused();
        comparisons++;
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else {
          arr[k++] = right[j++];
          swaps++;
        }
        renderBars();
        await sleep(speedSlider.value);
        updateStats();
      }
      while (i < left.length) arr[k++] = left[i++];
      while (j < right.length) arr[k++] = right[j++];
      renderBars();
    }

    await mergeSort(array, 0, array.length - 1);
  },

  "Quick Sort": async () => {
    async function quickSort(low, high) {
      if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
      }
    }

    async function partition(low, high) {
      let pivot = array[high];
      let i = low - 1;
      for (let j = low; j < high; j++) {
        await waitWhilePaused();
        comparisons++;
        if (array[j] < pivot) {
          i++;
          [array[i], array[j]] = [array[j], array[i]];
          swaps++;
          renderBars();
          await sleep(speedSlider.value);
          updateStats();
        }
      }
      [array[i + 1], array[high]] = [array[high], array[i + 1]];
      swaps++;
      renderBars();
      await sleep(speedSlider.value);
      updateStats();
      return i + 1;
    }

    await quickSort(0, array.length - 1);
  },

  "Heap Sort": async () => {
    async function heapify(n, i) {
      let largest = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && array[l] > array[largest]) largest = l;
      if (r < n && array[r] > array[largest]) largest = r;
      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        swaps++;
        renderBars();
        await sleep(speedSlider.value);
        updateStats();
        await heapify(n, largest);
      }
    }

    let n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
    for (let i = n - 1; i > 0; i--) {
      [array[0], array[i]] = [array[i], array[0]];
      swaps++;
      renderBars();
      await sleep(speedSlider.value);
      updateStats();
      await heapify(i, 0);
    }
  },

  "Shell Sort": async () => {
    let n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      for (let i = gap; i < n; i++) {
        let temp = array[i], j;
        for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
          await waitWhilePaused();
          comparisons++;
          array[j] = array[j - gap];
          swaps++;
          renderBars();
          await sleep(speedSlider.value);
          updateStats();
        }
        array[j] = temp;
        renderBars();
      }
    }
  },

  "Radix Sort": async () => {
    const getMax = () => Math.max(...array);
    let exp = 1;
    while (Math.floor(getMax() / exp) > 0) {
      let output = new Array(array.length).fill(0);
      let count = new Array(10).fill(0);

      for (let i = 0; i < array.length; i++) count[Math.floor(array[i] / exp) % 10]++;
      for (let i = 1; i < 10; i++) count[i] += count[i - 1];
      for (let i = array.length - 1; i >= 0; i--) {
        let idx = Math.floor(array[i] / exp) % 10;
        output[--count[idx]] = array[i];
        swaps++;
      }
      for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        renderBars();
        await sleep(speedSlider.value);
        updateStats();
      }
      exp *= 10;
    }
  }
};

setArrayBtn.onclick = () => {
  const size = parseInt(arraySizeInput.value);
  const values = customArrayInput.value
    .split(',')
    .map(v => parseInt(v.trim()))
    .filter(v => !isNaN(v) && v > 0);
  if (!size || values.length !== size) {
    alert("Please enter the correct array size and matching number of elements.");
    return;
  }
  array = values;
  renderBars();
  comparisons = swaps = 0;
  comparisonsText.textContent = "0";
  swapsText.textContent = "0";
  timeText.textContent = "0.0s";
};

window.onload = () => {
  setComplexity("Bubble Sort");
  setDescription("Bubble Sort");
};