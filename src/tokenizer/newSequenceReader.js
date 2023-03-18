export default function newSequenceReader(seq) {
  return (str, i = 0) => {
    let idx;
    const start = i;
    for (idx = 0; idx < seq.length && i < str.length; i++, idx++) {
      if (str[i] !== seq[idx])
        break;
    }
    if (idx !== seq.length)
      return;
    return {
      start,
      end: i
    };
  };
}
