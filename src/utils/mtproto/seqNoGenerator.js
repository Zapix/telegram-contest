export default function *seqNoGenerator() {
  let seqNo = 0;
  let notContentRelated = false;
  while (true) {
    let currentSeqNo = seqNo * 2;
    if (notContentRelated) {
      seqNo++;
      currentSeqNo++;
    }
    yield currentSeqNo
  }
}