"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = __importDefault(require("chai"));
var chai_as_promised_1 = __importDefault(require("chai-as-promised"));
var net_1 = __importDefault(require("net"));
var net_2 = require("./net");
var logger_1 = __importDefault(require("./logger"));
var expect = chai_1.default.expect;
chai_1.default.use(chai_as_promised_1.default);
describe('Net', function () {
    var port = 4567;
    var defaultHost = '0.0.0.0';
    var specialPort = process.platform.match('win') ? -1 : 80;
    // Utility function to create a server on a given port and return a Promise
    var createServer = function (p, host) {
        if (host === void 0) { host = defaultHost; }
        return new Promise(function (resolve, reject) {
            var server = net_1.default.createServer();
            server.on('error', function (err) { return reject(err); });
            server.on('listening', function () { return resolve(server); });
            server.listen({ port: p, host: host, exclusive: true }, function () {
                logger_1.default.info("test server is up on ".concat(host, ":").concat(p));
            });
        });
    };
    describe('#isPortAvailable', function () {
        context('when the port is not allowed to be bound', function () {
            it('returns a rejected promise', function () {
                return expect((0, net_2.isPortAvailable)(specialPort, defaultHost)).to.eventually.be
                    .rejected;
            });
        });
        context('when the port is available', function () {
            it('returns a fulfilled promise', function () {
                return expect((0, net_2.isPortAvailable)(port, defaultHost)).to.eventually.be.fulfilled;
            });
        });
        context('when the port is unavailable', function () {
            var closeFn = function (cb) { return cb(); };
            it('returns a rejected promise', function () {
                return createServer(port).then(function (server) {
                    closeFn = server.close.bind(server);
                    return expect((0, net_2.isPortAvailable)(port, defaultHost)).to.eventually.be
                        .rejected;
                });
            });
            // close the servers used in this test as to not conflict with other tests
            afterEach(function (done) { return closeFn(done); });
        });
        context('when a single host is unavailable', function () {
            var closeFn = function (cb) { return cb(); };
            it('returns a fulfilled promise', function () {
                // simulate ::1 being unavailable
                return createServer(port, '::1').then(function (server) {
                    closeFn = server.close.bind(server);
                    // this should work as the `127.0.0.1` is NOT `::1`
                    return expect((0, net_2.isPortAvailable)(port, '127.0.0.1')).to.eventually.be
                        .fulfilled;
                });
            });
            // close the servers used in this test as to not conflict with other tests
            afterEach(function (done) { return closeFn(done); });
        });
    });
});
//# sourceMappingURL=net.spec.js.map