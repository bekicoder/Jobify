import FastText from "fasttext.js";
import path from "path";

let model: any;

async function loadModel() {
  if (!model) {
    model = new FastText({
      loadModel: {
        model: path.join(process.cwd(), "models/lid.176.ftz"),
      },
    });
    await model.load();
  }
  return model;
}

export async function detectLanguage(text: string) {
  const ft = await loadModel();
  const predictions = await ft.predict(text);

  if (!predictions || predictions.length === 0) {
    return "en"; // fallback
  }

  return predictions[0].label.replace("__label__", "");
}
