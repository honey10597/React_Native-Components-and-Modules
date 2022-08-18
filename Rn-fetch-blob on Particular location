const startDownload = async type => {
const dir = await RNFetchBlob.fs.dirs;
console.log(dir, 'dircetoipi');
// const {tunes, token, currentTrackIndex} = this.state;
let url =
type == 'mp4'
? IMAGE_BASE_URL + item?.media[1]?.media
: IMAGE_BASE_URL + item?.media[0]?.media;
let name = item?.title;
setDownloadLoader(true);
let mp3Dir = RNFetchBlob.fs.dirs.DownloadDir;

let date = new Date();

let mp3url = getExtention(url);
mp3url = '.' + mp3url[0];

const options = Platform.select({
ios: {
fileCache: true,
appendExt: mp3url == '.mp4' ? 'mp4' : 'mp3',
path:
mp3url == '.mp4'
? RNFetchBlob.fs.dirs.DocumentDir + '/' + name + '.mp4'
: RNFetchBlob.fs.dirs.DocumentDir + '/' + name + '.mp3',
},
android: {
fileCache: true,
path:
mp3url == '.mp4'
? RNFetchBlob.fs.dirs.DownloadDir + '/Vbyr/Videos/' + name + mp3url
: RNFetchBlob.fs.dirs.DownloadDir + '/Vbyr/Music/' + name + mp3url,
},
});

console.log(options, 'url++++++');

RNFetchBlob.config(options)
.fetch('GET', url.trim())
.progress((current, total) => {
console.log(current / total, 'hello world');
setProgress(current / total);
})
.then(res => {
console.log('res', res);
if (Platform.OS === 'ios') {
if (mp3url == '.mp4') {
console.log('in mp4');
RNFetchBlob.ios.previewDocument(
RNFetchBlob.fs.dirs.DocumentDir + '/' + name + '.mp4',
);
} else {
console.log('in mp3');
RNFetchBlob.ios.previewDocument(
RNFetchBlob.fs.dirs.DocumentDir + '/' + name + '.mp3',
);
// RNFetchBlob.ios.previewDocument(RNFetchBlob.fs.dirs.DocumentDir + '/' + name + '.mp3');
}
}
setShowAnimation(true);
animation.current.play(25, 80);
setProgress(0);
setDownloadLoader(false);
})
.catch(err => {
console.log(err);
setDownloadLoader(false);
});
};
