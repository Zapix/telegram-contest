export default function* seqNoGenerator() {
  let seqNo = 1;
  while (true) {
    seqNo += 2;
    console.log(`Generated seqNo: ${seqNo}`);
    yield seqNo;
  }
}
