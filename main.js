let localStream;                                  
let connnectedCall = null;             //接続したコールを保存しておく

const closeTrigger = document.getElementById('disc');

// カメラ映像取得
navigator.mediaDevices.getUserMedia({video: true, audio: true})
  .then( stream => {
  const videoElment = document.getElementById('my-video');
  videoElment.srcObject = stream;
  videoElment.play();
  // 着信時に相手にカメラ映像を返せるように、グローバル変数に保存しておく
  localStream = stream;
}).catch( error => {
  // エラーログを出力
  alert(error);
  console.error('mediaDevice.getUserMedia() error:', error);
  return;
});

const peer = new Peer({
    key: 'e377b3fd-3349-440a-a99e-860b7476596a',
    debug: 3,
});


//正常にサーバーに接続できたときに呼ばれる
peer.on('open', function(peerId)  
{
    //自分自身のPeerID 
    console.log(peerId);

    //Skyway serverに自分のApi Keyでつないでいるユーザー一覧を表示
    _ = peer.listAllPeers( peers => {
        console.log(peers);
        let idx = 1;
        // document.getElementById('id-list').textContent = peers;
        peers.forEach(element => {
           let list = document.getElementById('id-list')

            //自分のIDはボタン表示にしない    
           if(element == peerId)
           {
            list.insertAdjacentHTML("beforeend", "<p class=myID>MyID"+":"+element+"</p>");
           }else{
            list.insertAdjacentHTML("beforeend", "<button class=make-call>ID"+idx+":"+element+"</button>");
           }
            idx++;
        }); 
    });
});

// document.getElementById('make-call').onclick = () => {
//     const theirId = document.getElementById('their-id').value;
//     const mediaConnection = peer.call(theirId, localStream);
//     setEventListener(mediaConnection);
// };


//選択したIDにCallする
document.querySelector('body').addEventListener('click', function(event)
{
    if(event.target.tagName.toLowerCase() === 'button')
    {
        const id = event.target.textContent;
        let result = id.split(':');
        
        const mediaConnection = peer.call(result[1], localStream);
        setEventListener(mediaConnection);
    }
});

const setEventListener = mediaConnection => {
    if(!connnectedCall === null)
    {
        connnectedCall.close();
    }

    connnectedCall = mediaConnection;
    mediaConnection.on('stream', stream => {
        const videoElement = document.getElementById('their-video');
        videoElement.srcObject = stream;
        alert("接続されました!");
        videoElement.play();
    });
}

//着信処理
peer.on('call', mediaConnection => {
    mediaConnection.answer(localStream);
    setEventListener(mediaConnection);
});

peer.on('error', console.error);

// document.getElementById('make-call').onclick = () => {
//     const theirId = document.getElementById('their-id').value;
//     const mediaConnection = peer.call(theirId, localStream);
//     setEventListener(mediaConnection);
// };

document.getElementById('disc').onclick = () => {
    console.log(connnectedCall);
    connnectedCall.close();
}
