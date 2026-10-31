"""Package pinned corresponding source for firmware 1.7.1 into dist/legal.
Original notices remain unmodified. No firmware compilation or flashing.
"""
from pathlib import Path, PurePosixPath
from urllib.request import urlopen, Request
from concurrent.futures import ThreadPoolExecutor
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import tarfile, json, shutil, stat, hashlib, time
ROOT=Path(__file__).resolve().parents[1]
lock=json.loads((ROOT/'docs/firmware-source-lock.json').read_text(encoding='utf-8'))
cache=ROOT/'.cache/firmware-source';cache.mkdir(parents=True,exist_ok=True)
out=ROOT/'dist/legal';out.mkdir(parents=True,exist_ok=True)
def fetch(repo):
 path=cache/(repo['commit']+'.tar.gz')
 if not path.exists():
  url=f"https://codeload.github.com/{repo['repository']}/tar.gz/{repo['commit']}"
  for attempt in range(3):
   try:
    with urlopen(Request(url,headers={'User-Agent':'DongleSense-source-distribution'}),timeout=180) as response: data=response.read()
    with tarfile.open(fileobj=__import__('io').BytesIO(data),mode='r:gz') as archive:
     if not archive.getmembers():raise ValueError('Empty source archive')
    path.write_bytes(data);break
   except Exception:
    if attempt==2:raise
    time.sleep(2)
 return repo,path
with ThreadPoolExecutor(max_workers=4) as pool: archives=list(pool.map(fetch,lock['repositories']))
target=out/'firmware-source-1.7.1.zip'
with ZipFile(target,'w',ZIP_DEFLATED,compresslevel=6) as z:
 for repo,path in archives:
  with tarfile.open(path,'r:gz') as tar:
   for member in tar:
    parts=PurePosixPath(member.name).parts[1:]
    if not parts or '..' in parts:continue
    name='/'.join([repo['directory'],*parts])
    if not (member.isfile() or member.issym()):continue
    info=ZipInfo(name,(2026,8,30,0,0,0));info.create_system=3;info.compress_type=ZIP_DEFLATED
    if member.issym():info.external_attr=(stat.S_IFLNK|0o777)<<16;data=member.linkname.encode()
    else:
     info.external_attr=(stat.S_IFREG|member.mode)<<16
     data=tar.extractfile(member).read()
    z.writestr(info,data)
 for name in ['SOURCE-BUILD.md','source-lock.json','upstream-LICENSE.txt','upstream-NOTICE.txt','upstream-manifest.json']:
  z.write(ROOT/'public/legal'/name,name)
with ZipFile(target) as z:
 assert z.testzip() is None
 required=['DS5_Bridge/src/main.cpp','DS5_Bridge/lib/opus/COPYING','DS5_Bridge/lib/WDL/WDL/resample.cpp','pico-sdk/src/rp2_common/pico_btstack/LICENSE.RP','pico-sdk/lib/tinyusb/LICENSE','pico-sdk/lib/btstack/LICENSE','pico-sdk/lib/cyw43-driver/LICENSE.RP','pico-sdk/lib/mbedtls/framework/README.md']
 for name in required:assert name in z.namelist(),name
(out/'firmware-source-1.7.1.sha256').write_text(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name+'\n',encoding='ascii')
print(f'Source archive verified: {target.stat().st_size} bytes')
