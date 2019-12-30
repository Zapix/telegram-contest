export default function* seqNoGenerator() {
  let seqNo = 0;
  const notContentRelated = false;
  while (true) {
    let currentSeqNo = seqNo * 2;
    if (notContentRelated) {
      seqNo += 1;
      currentSeqNo += 1;
    }
    yield currentSeqNo;
  }
}
