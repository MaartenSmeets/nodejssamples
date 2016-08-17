Create dirs and add to env
KVHOME
KVROOT
KVDATA

Make
java -jar $KVHOME/lib/kvstore.jar makebootconfig -root $KVROOT -store-security none -capacity 1 -harange 5010,5030 -admin 5001 -port 5000 -memory_mb 1024 -host localhost -storagedir $KVDATA

Start
nohup java -Xmx256m -Xms256m -jar $KVHOME/lib/kvstore.jar start -root $KVROOT &

Configure
java -Xmx256m -Xms256m -jar $KVHOME/lib/kvstore.jar runadmin -port 5000 -host localhost <<EOF
configure -name mystore
plan deploy-zone -name "LocalZone" -rf 1 -wait
plan deploy-sn -zn zn1 -host localhost -port 5000 -wait
plan deploy-admin -sn sn1 -port 5001 -wait
pool create -name LocalPool
show topology
pool join -name LocalPool -sn sn1
topology create -name topo -pool LocalPool -partitions 10
topology preview -name topo
plan deploy-topology -name topo -wait
show plan
EOF