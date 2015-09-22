import text from "ui/input/text";
import number from "ui/input/number";
import select from "ui/input/select";
import seconds from "ui/input/seconds";
import money from "ui/input/money";
import bitmask from "ui/input/bitmask";

export default function Input(form) {
  return {
    text: text.bind(Input, form),
    number: number.bind(Input, form),
    seconds: seconds.bind(Input, form),
    money: money.bind(Input, form),
  	select: select.bind(Input, form),
  	bitmask: bitmask.bind(Input, form),
  }
}
