const JestEnvironmentJsdom = require('jest-environment-jsdom');

class JsdomWithTextEncoderDecoderEnvironment extends JestEnvironmentJsdom {
  async setup() {
    await super.setup();
    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
  }
}

module.exports = JsdomWithTextEncoderDecoderEnvironment;
