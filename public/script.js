const socket = io();
const roomId = location.hash.slice(1) || Math.random().toString(36).substring(2);
location.hash = roomId;
socket.emit('join-room', roomId);

let peers = {};
let localStream = null;

socket.on('user-joined', id => {
  const peer = new SimplePeer({ initiator: true });
  setupPeer(peer, id);
});

socket.on('signal', data => {
  if (!peers[data.from]) {
    const peer = new SimplePeer();
    setupPeer(peer, data.from);
  }
  peers[data.from].signal(data.signal);
});

socket.on('user-left', id => {
  if (peers[id]) {
    peers[id].destroy();
    delete peers[id];
  }
});

function setupPeer(peer, id) {
  peers[id] = peer;
  peer.on('signal', signal => {
    socket.emit('signal', { to: id, signal });
  });
  peer.on('data', data => {
    document.getElementById('chat').innerHTML += `<p><b>Received:</b> ${data}</p>`;
  });
}

function sendMessage() {
  const msg = document.getElementById('message').value;
  for (let id in peers) {
    peers[id].send(msg);
  }
  document.getElementById('chat').innerHTML += `<p><b>You:</b> ${msg}</p>`;
}

document.getElementById('fileInput').addEventListener('change', e => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    for (let id in peers) {
      peers[id].send(reader.result);
    }
  };
  reader.readAsArrayBuffer(file);
});

// Generate QR
QRCode.toCanvas(document.getElementById('qrcode'), location.href);
