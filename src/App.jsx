import { useState } from "react";
import dictData from "./assets/char_phon_simp.json";
import Dinishing from "./assets/dinishing.svg?react";
const footerlinks = [
  { link: "https://github.com/DINISHING/nguphing-marker", text: "源碼棚" },
  {
    link: "https://github.com/DINISHING/standards/tree/main/phonetics",
    text: "拼音方案",
  },
  { link: "https://github.com/DINISHING/vocabulary", text: "字音庫" },
];

function App() {
  const [name, setName] = useState("");
  const [romanization, setRomanization] = useState("");
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.target;
    const formData = new FormData(form);
    setName(formData.get("shiunih"));
    setRomanization(formData.get("fongoe"));
  }

  return (
    <>
      <h1>吳語拼音標註器</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="shiunih"
          className="form-control my-2"
          defaultValue="金石恆久遠，吳語永承傳。"
          rows={4}
        />
        <div className="row">
          <div className="col-sm-6 col-md-3">
            <select className="form-control" name="fongoe">
              <option value="NR" selected>
                吳語羅馬字
              </option>
              <option value="IPA">IPA（本調）</option>
              <option value="NY">吳語協會拼音</option>
            </select>
          </div>
          <div className="col-sm-2">
            <button className="btn btn-outline-primary" type="submit">
              轉換
            </button>
          </div>
        </div>
      </form>
      <div className="my-3" id="shiuchiuh">
        <Romanization name={name} spelling={romanization} />
      </div>
      <hr />
      <ul className="nav justify-content-center">
        {footerlinks.map((item) => (
          <li className="nav-item">
            <a className="nav-link" href={item.link}>
              {item.text}
            </a>
          </li>
        ))}
        <li className="nav-item">
          <a className="nav-link" href="https://github.com/DINISHING/">
            <Dinishing id="dns" />
          </a>
        </li>
      </ul>
    </>
  );
}

function Romanization({ name, spelling }) {
  if (!name) {
    return null;
  }
  const romanizationList = lookupRomanization(name);
  console.log(romanizationList);
  const listItems = romanizationList.map(({ char, rom }) => {
    if (rom) {
      return (
        <ruby>
          {char}
          <rt>
            <ul>
              {rom.map((ki) => (
                <li>
                  {spelling == "IPA"
                    ? toIpa(ki)
                    : spelling == "NY"
                    ? toYaehwei(ki)
                    : ki}
                </li>
              ))}
            </ul>
          </rt>
        </ruby>
      );
    } else {
      return <>{char}</>;
    }
  });
  return listItems;
}

function lookupRomanization(name) {
  var result = [];
  const regexp =
    /[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}]/u;
  for (const char of name) {
    if (regexp.test(char)) {
      console.log(char);
      const A = dictData[char];
      console.log(A);
      result.push({ char: char, rom: A });
    } else {
      result.push({ char: char, rom: null });
    }
  }

  return result;
}

function toYaehwei(inputString) {
  const replacements = [
    [/ts/g, "tsh"],
    [/tz/g, "tz"],
    [/oh/g, "oeh"],
    [/ah/g, "aeh"],
    [/uk/g, "oh"],
    [/ung/g, "on"],
    [/ok/g, "aoh"],
    [/ong/g, "aon"],
    [/ek/g, "eoh"],
    [/eng/g, "eon"],
    [/ik/g, "ieoh"],
    [/ing/g, "ieon"],
    [/ak/g, "ah"],
    [/ang/g, "an"],
    [/iun/g, "iuin"],
    [/iuh/g, "iuih"],
  ];

  let resultString = inputString;
  for (const replacement of replacements) {
    const regex = replacement[0];
    const replaceWith = replacement[1];
    resultString = resultString.replace(regex, replaceWith);
  }
  return resultString;
}

function toIpa(inputString) {
  const replacements = [
    [/([ptkc])h/g, "$1ʰ"],
    [/el/g, "ɦɚ"],
    [/ts/g, "tsʰ"],
    [/tz/g, "ts"],
    [/dz/g, "dz"],
    [/c/g, "tɕ"],
    [/j/g, "dʑ"],
    [/sh/g, "ɕ"],
    [/zh/g, "ʑ"],
    [/y([aueo])/g, "ghi$1"],
    [/yi/g, "ghi"],
    [/w([aieo])/g, "ghu$1"],
    [/wu/g, "ghu"],
    [/gh/g, "ɦ"],
    [/ng/g, "ŋ"],
    [/g/g, "ɡ"],
    [/ni/g, "nʲi"],
    [/(^| )([aiueo])/g, "$1ʔ$2"],
    [/(l|m|ng)h/g, "ʔ$1"],
    [/y/g, "ɿ"],
    [/iu/g, "y"],
    [/y(ŋ|k)/g, "iu$1"],
    [/yn/g, "yŋ"],
    [/yh/g, "yʔ"],
    [/iŋ/g, "ieŋ"],
    [/ik/g, "iek"],
    [/([iu])([aiueo])/g, "$1̯$2"],
    [/in/g, "iŋ"],
    [/en/g, "əŋ"],
    [/ih/g, "iʔ"],
    [/eh/g, "əʔ"],
    [/eŋ/g, "ʌŋ"],
    [/ek/g, "ʌʔ"],
    [/uŋ/g, "Uŋ"],
    [/uk/g, "Uʔ"],
    [/oŋ/g, "ɔ̃"],
    [/ok/g, "ɔʔ"],
    [/U/g, "o"],
    [/aŋ/g, "ã"],
    [/ak/g, "aʔ"],
    [/ae/g, "ɛ"],
    [/ah/g, "ɛʔ"],
    [/oe/g, "ø"],
    [/oh/g, "øʔ"],
    [/au/g, "ɔ"],
    [/eu/g, "ɤ"],
    [/ou/g, "əʊ"],
    [/ʔ($| )/g, "ʔ1$1"],
    [/((^| )[ptkhʔfsɕ][^ ]+[123])/g, "$1X"],
    [/1X/g, "˦"],
    [/2X/g, "˥˧"],
    [/3X/g, "˧˥"],
    [/1/g, "˨"],
    [/2/g, "˧˩"],
    [/3/g, "˩˧"],
  ];

  let resultString = inputString;
  for (const replacement of replacements) {
    const regex = replacement[0];
    const replaceWith = replacement[1];
    resultString = resultString.replace(regex, replaceWith);
  }
  return resultString;
}

export default App;
