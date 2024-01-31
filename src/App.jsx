import { useState } from "react";
//import dictData from "./assets/char_phon_simp.json";
import Dinishing from "./assets/dinishing.svg?react";
const footerlinks = [
  { link: "https://github.com/DINISHING/nguphing-marker", text: "源碼棚" },
  {
    link: "https://github.com/DINISHING/standards/tree/main/phonetics",
    text: "拼音方案",
  },
  { link: "https://github.com/DINISHING/vocabulary", text: "字音庫" },
];

var dictData;
async function fetchJSON() {
  console.log("Loading dictionary...");
  const response = await fetch("/char_phon_simp.json");
  const json = await response.json();
  dictData = json;
  console.log("Loaded dictionary.");
}
fetchJSON();

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
              <option value="PD">變調（試驗性）</option>
            </select>
          </div>
          <div className="col-sm-2">
            <button className="btn btn-outline-primary" type="submit">
              轉換
            </button>
          </div>
        </div>
      </form>
      <div className="my-3">
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
  if (spelling == "PD") {
    const romanizationList = wordRomanization(name);
    return (
      <div className="d-flex" id="shiuchiuhexp">
        {romanizationList.map((char) => (
          <ul className="touinzy">
            {char.map((ki) => (
              <li>{ki}</li>
            ))}
          </ul>
        ))}
      </div>
    );
  } else {
    const romanizationList = lookupRomanization(name);
    const listItems =
      window.navigator.userAgent.indexOf("Chrome") !== -1
        ? romanizationList.map(({ char, rom }) => {
            //is Chrome
            if (rom) {
              return (
                <ruby>
                  <rb>{char}</rb>
                  <rt>
                    {rom.map((ki) => (
                      <>
                        {spelling == "IPA"
                          ? toIpa(ki)
                          : spelling == "NY"
                          ? toYaehwei(ki)
                          : ki}
                        <br></br>
                      </>
                    ))}
                  </rt>
                </ruby>
              );
            } else {
              return <>{char}</>;
            }
          })
        : romanizationList.map(({ char, rom }) => {
            //is not Chrome
            if (rom) {
              return (
                <ruby>
                  <rb>{char}</rb>
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
    return <div id="shiuchiuh">{listItems}</div>;
  }
}

function lookupRomanization(name) {
  var result = [];
  const regexp =
    /[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}]/u;
  for (const char of name) {
    if (regexp.test(char)) {
      const A = dictData[char];
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

function toIpaNoTone(inputString) {
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
  ];

  let resultString = inputString;
  for (const replacement of replacements) {
    const regex = replacement[0];
    const replaceWith = replacement[1];
    resultString = resultString.replace(regex, replaceWith);
  }
  return resultString;
}

function wordRomanization(words) {
  function generateCombinations(arr, current = []) {
    if (arr.length === 0) {
      return [current];
    }

    const firstArray = arr[0];
    let combinations = [];

    for (let i = 0; i < firstArray.length; i++) {
      const newCurrent = [...current, firstArray[i]];
      combinations = combinations.concat(
        generateCombinations(arr.slice(1), newCurrent)
      );
    }
    return combinations;
  }
  var result = [];
  const regexp =
    /^[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}]$/u;
  const regexp_2 =
    /^[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}]{2}$/u;
  for (const word of words.split(" ")) {
    if (regexp.test(word)) {
      //single char
      const char = dictData[word];
      result.push(
        char.map((a) => toIpaNoTone(toneConvOne(analyseSyllable(a))))
      );
    } else if (regexp_2.test(word)) {
      //two sandhi
      const char = generateCombinations([
        dictData[word.slice(0, 1)].map((a) => analyseSyllable(a)),
        dictData[word.slice(1, 2)].map((a) => analyseSyllable(a)),
      ]);
      result.push(char.map((a) => toIpaNoTone(toneConvTwo(a))));
    } else {
      result.push([word]);
    }
  }
  //金 石 恆 久 遠 ， 吳 語 永 承 傳 。
  return result;
}

function analyseSyllable(syl) {
  /*input "zing3"
    output ["sing", 6 ]
  */
  var diau = syl.slice(-1);
  diau = /\d/.test(diau) ? parseInt(diau) : 4;
  const res = syl.replace(/\d/, "");
  diau = /^([ptkhtscaeiou]|[lmn]h|ngh)/.test(res) ? 2 * diau - 1 : 2 * diau;
  return [res, diau];
}

function toneConvOne(char) {
  /*input ["sing", 6 ]
    output "sing˨˦"
  */
  const table = ["˦", "˨", "˥˨", "˧˩", "˧˥", "˨˦", "˦", "˨"];
  return char[0] + table[char[1] - 1];
}

function toneConvTwo(char) {
  /*input [["su", 1 ],["cieu", 1 ]]
    output "su˦˦cieu˥˨"
  */
  const table = [
    [
      ["˦", "˥˨"],
      ["˦", "˧˩"],
      ["˦", "˧"],
      ["˦", "˨"],
    ],
    [
      ["˨", "˥˩"],
      ["˨", "˥˨"],
      ["˨", "˥˨"],
      ["˨", "˥˨"],
    ],
    [
      ["˧˩", "˩˧"],
      ["˦", "˧˩"],
      ["˧˩", "˧"],
      ["˧˩", "˧"],
    ],
    [
      ["˨˩", "˩˧"],
      ["˨", "˧˩"],
      ["˨˩", "˧"],
      ["˨˩", "˧"],
    ],
    [
      ["˦", "˧˩"],
      ["˧˦", "˧˩"],
      ["˧˦", "˧"],
      ["˧˦", "˧"],
    ],
    [
      ["˨", "˧˩"],
      ["˨˧", "˧˩"],
      ["˨˧", "˧"],
      ["˨˧", "˧"],
    ],
    [
      ["˦", "˥˩"],
      ["˦", "˧˩"],
      ["˦", "˩˧"],
      ["˦", "˧"],
    ],
    [
      ["˨", "˥˩"],
      ["˨", "˧˩"],
      ["˨", "˩˧"],
      ["˨", "˧"],
    ],
  ];
  const tone = table[char[0][1] - 1][Math.ceil(char[1][1] / 2) - 1];
  return char[0][0] + tone[0] + char[1][0] + tone[1];
}

export default App;
