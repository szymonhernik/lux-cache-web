import HomePage from '@/components/pages/home/HomePage'
import HomePagePreview from '@/components/pages/home/HomePagePreview'
import { createClient } from '@/utils/supabase/server'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { loadPosts } from '@/sanity/loader/loadQuery'

export default async function SplashPage() {
  // const supabase = createClient()

  // const {
  //   data: { user }
  // } = await supabase.auth.getUser()

  // if (user) {
  //   // redirect('/browse')
  // }

  const initial = await loadPosts()

  if (draftMode().isEnabled) {
    return <HomePagePreview initial={initial} />
  }

  return <HomePage data={initial.data} />
}

// function LoremIpsum() {
//   return (
//     <p className="text-primary-foreground">
//       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris porta nisi
//       non velit maximus, quis efficitur lacus viverra. Phasellus dapibus mauris
//       a mauris laoreet rhoncus. Suspendisse tristique dui et lorem vestibulum, a
//       ultricies nunc pretium. Etiam eu blandit nibh. Vestibulum hendrerit vitae
//       justo a imperdiet. Quisque in felis eget tellus aliquam pellentesque et
//       quis est. Orci varius natoque penatibus et magnis dis parturient montes,
//       nascetur ridiculus mus. Aenean lobortis ullamcorper leo id bibendum.
//       Aenean ut lectus sem. Ut aliquam laoreet imperdiet. Nullam semper nisl a
//       justo facilisis volutpat. Sed venenatis nulla at purus pellentesque,
//       cursus sollicitudin metus mollis. Nam quam odio, convallis id dictum et,
//       fermentum at mi. Phasellus sagittis malesuada diam, condimentum hendrerit
//       mauris vehicula vel. Nam vel diam porta, elementum enim sed, pellentesque
//       urna. Pellentesque quis felis suscipit, vestibulum dui vel, hendrerit
//       velit. Nulla iaculis enim non euismod consequat. In eu nunc laoreet,
//       ornare arcu quis, aliquet felis. Mauris dapibus mollis malesuada. Donec
//       ultricies libero eu fringilla lacinia. In erat justo, cursus egestas
//       ligula vitae, lobortis pretium quam. Nulla dapibus ante urna, nec
//       scelerisque ipsum commodo ac. Sed in metus eu nibh blandit consequat.
//       Pellentesque mollis erat ut sem scelerisque malesuada eget posuere nisl.
//       Etiam iaculis consectetur eros. Cras vel urna eget nisl iaculis venenatis.
//       Nulla nec nunc magna. Suspendisse volutpat condimentum lorem, vitae
//       posuere quam aliquam porta. Phasellus porta justo in urna molestie
//       bibendum. Suspendisse hendrerit nisi vitae ex ultrices mattis. Vestibulum
//       ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
//       curae; Nulla accumsan dignissim blandit. Praesent augue lorem, commodo a
//       metus at, condimentum blandit neque. Quisque ac turpis lorem. Suspendisse
//       placerat leo quis nisl hendrerit mollis. Vivamus pellentesque dolor id
//       blandit lacinia. Morbi erat nunc, varius nec orci in, fermentum pharetra
//       sapien. Vestibulum eget pellentesque justo. Duis vestibulum neque quis
//       enim faucibus tristique. Sed egestas magna quis commodo imperdiet.
//       Vestibulum fermentum ullamcorper metus. Quisque finibus eget felis quis
//       sodales. In tristique nibh ac semper placerat. Quisque vehicula neque
//       lacus, non sagittis est pharetra ac. Sed a condimentum magna, quis iaculis
//       ipsum. Curabitur sed dolor dui. Sed nec leo lorem. Nullam tincidunt massa
//       vitae posuere porta. Integer porta enim maximus odio ultrices, vel
//       efficitur quam luctus. Morbi ac semper neque. Vestibulum consectetur eu
//       quam sit amet rutrum. Mauris luctus arcu eu nulla auctor, ut condimentum
//       erat euismod. Maecenas turpis nisl, rutrum dictum diam quis, consequat
//       tincidunt massa. Curabitur vitae congue orci, vel consectetur arcu.
//       Praesent vel elit at justo vestibulum accumsan in vel sem. Nulla fringilla
//       ullamcorper metus, sed ullamcorper lacus. Maecenas facilisis aliquam
//       tellus, et cursus libero interdum non. Ut quis feugiat metus. Aliquam
//       imperdiet, massa eget egestas facilisis, velit tellus auctor nisl, nec
//       vestibulum ante magna id dui. Ut et velit non nibh suscipit iaculis. Fusce
//       viverra, eros iaculis imperdiet efficitur, odio mi finibus magna, non
//       semper magna tortor sed dolor. Maecenas rhoncus enim justo, vitae maximus
//       tortor volutpat ut. Quisque consequat dignissim lacinia. Aliquam varius,
//       mi et facilisis ornare, ex justo eleifend ipsum, ut condimentum orci massa
//       tincidunt turpis. Aenean accumsan risus ex, sed luctus elit mattis ac.
//       Vivamus euismod, sem quis laoreet fermentum, lacus nulla ullamcorper
//       lorem, eget ultricies eros arcu eu nulla. Nunc justo ante, varius in dolor
//       non, tempor venenatis purus. Mauris lobortis elit vitae dolor tincidunt,
//       vel pharetra enim elementum. Aliquam posuere, lacus quis pretium
//       tincidunt, ligula urna efficitur urna, nec suscipit mi purus quis nisl. In
//       tempus justo tellus. Vestibulum euismod ac metus nec egestas. Aenean
//       blandit metus et quam rhoncus mattis. Vestibulum at tempor lorem, nec
//       vulputate odio. Proin vel ultricies magna, quis pellentesque ex. Cras
//       tortor orci, laoreet eu ex vitae, rutrum sagittis felis. Vivamus eget
//       lorem metus. Etiam mi neque, commodo a ultricies vitae, luctus ut orci.
//       Morbi finibus velit ac tristique consectetur. Suspendisse eget tempus
//       ipsum. Suspendisse bibendum dictum venenatis. Curabitur elementum at neque
//       eu gravida. Nulla semper mi a dolor commodo facilisis. Phasellus faucibus
//       eros neque. Morbi est lorem, pellentesque quis ex et, ullamcorper lobortis
//       urna. In finibus risus tellus, lobortis congue orci imperdiet non. Aliquam
//       dapibus ullamcorper cursus. Cras porta mauris sit amet quam aliquet
//       tincidunt. Praesent semper metus sit amet lectus condimentum venenatis.
//       Sed maximus pharetra nulla in vestibulum. Ut a posuere turpis. Aliquam
//       turpis turpis, aliquam non ultricies vitae, eleifend at libero. Nullam at
//       tempor sem. Donec finibus commodo purus at varius. Cras efficitur ut quam
//       sit amet elementum. Quisque non pellentesque arcu. Vestibulum vitae
//       placerat quam, ac egestas leo. Proin posuere justo felis, eu euismod
//       tortor venenatis vel. Mauris convallis arcu ipsum, eu suscipit enim
//       bibendum fringilla. Nunc ac vestibulum ex, ut tristique libero. Etiam ex
//       nunc, tincidunt id mi eu, ullamcorper tempus nibh. Donec non ligula quis
//       lectus posuere fringilla. Donec maximus mauris est, a ornare nunc vehicula
//       et. Pellentesque habitant morbi tristique senectus et netus et malesuada
//       fames ac turpis egestas. Aliquam tempor eu neque quis sodales. Curabitur
//       ut aliquet metus. Aenean sed sollicitudin diam, et ultricies dolor. Duis
//       pharetra risus sed ipsum consequat, sed molestie nulla sodales. Ut vitae
//       diam tortor. Sed in ex eu nibh mattis ornare sit amet nec nunc. Vivamus et
//       lorem purus. Nullam gravida, urna vel blandit tempor, nisi ex gravida
//       erat, a maximus odio lectus vitae arcu. Suspendisse vehicula, risus quis
//       varius venenatis, dui urna porta lectus, in consequat quam est viverra
//       sapien. Vestibulum et nibh ligula. Integer tincidunt vel tellus quis
//       convallis. Vivamus vitae enim vel sem suscipit feugiat eu a orci. Sed
//       imperdiet lacus vel elementum pretium. Ut mattis odio id metus bibendum
//       aliquet in a felis. Vestibulum ante ipsum primis in faucibus orci luctus
//       et ultrices posuere cubilia curae; Fusce vehicula, augue vel convallis
//       maximus, leo lectus imperdiet augue, vel auctor ipsum massa eget nisl. Ut
//       viverra quam sed consectetur posuere. Aliquam sapien turpis, viverra vitae
//       tortor in, eleifend lobortis enim. Curabitur et sapien arcu. Pellentesque
//       id erat egestas, pellentesque tortor quis, sodales tellus. Proin congue
//       pellentesque mi vel vestibulum. Cras dignissim, leo eu vulputate
//       imperdiet, enim arcu posuere leo, quis consectetur ex eros ac risus. Nunc
//       vitae risus condimentum, bibendum urna vel, convallis diam. Orci varius
//       natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
//       Ut tempus dolor urna, eget lacinia enim ultrices in. Nullam interdum orci
//       a elementum rhoncus. In vel purus tincidunt felis scelerisque luctus.
//       Integer vehicula urna id libero tincidunt, quis molestie est maximus.
//       Nulla non purus scelerisque, lobortis justo vel, convallis nulla. Aenean
//       ultricies ante non ante consequat, scelerisque rutrum risus volutpat.
//       Integer faucibus dolor ac metus eleifend, quis ornare diam elementum.
//       Morbi neque quam, vulputate a nibh et, hendrerit pharetra lacus. Donec ac
//       consectetur nunc. Pellentesque imperdiet augue ut dui egestas mattis.
//       Donec gravida ac dui sit amet rhoncus. Donec mauris nunc, lacinia id velit
//       nec, placerat eleifend nulla. Nullam commodo maximus mattis. Integer at
//       sollicitudin velit, non facilisis nisi. Etiam scelerisque iaculis lorem
//       quis dapibus. Pellentesque imperdiet mauris quam, a rhoncus metus interdum
//       et. Nunc rutrum sem non nibh blandit interdum. Vestibulum elit elit,
//       sollicitudin quis risus ut, consequat lacinia tortor. Cras faucibus quis
//       mi ac tempus. Vestibulum ante ipsum primis in faucibus orci luctus et
//       ultrices posuere cubilia curae; Cras vitae mauris in mi molestie maximus
//       consequat elementum felis. In enim quam, mattis in volutpat in, blandit
//       quis tortor. Nulla venenatis condimentum leo, vel pellentesque dui
//       fermentum eget. Aenean pulvinar, lorem non condimentum accumsan, dolor est
//       fermentum enim, et cursus ipsum augue non dolor. Proin sit amet rhoncus
//       nunc. Maecenas rutrum tortor in neque volutpat, efficitur euismod leo
//       ultricies. Phasellus vel metus orci. Ut feugiat justo sed maximus viverra.
//       Nulla vitae massa id neque maximus faucibus condimentum ut nunc. Donec
//       risus neque, aliquam eu leo vel, faucibus laoreet metus. Aliquam dapibus
//       urna id risus accumsan, eu auctor odio lobortis. Etiam id pulvinar libero.
//       Vestibulum eu nibh convallis dui varius sodales. Mauris et tincidunt
//       tortor. Aliquam odio magna, lobortis et laoreet eget, cursus nec turpis.
//       Nullam sodales tortor odio, id aliquam orci porta vel. Donec quis quam
//       interdum, vestibulum ante hendrerit, mattis mauris. Mauris fermentum elit
//       eu varius dictum. Morbi ultrices finibus condimentum. Aenean iaculis diam
//       id arcu rhoncus, ut pulvinar ligula facilisis. Maecenas vitae tortor
//       tortor. Duis posuere massa egestas augue pellentesque vulputate. Donec
//       pellentesque non nibh non volutpat. Aliquam quam sem, tincidunt sed
//       vehicula nec, sollicitudin sit amet leo. Etiam semper commodo sapien, sed
//       blandit dui vestibulum non. Morbi ut purus at mi finibus fermentum
//       vehicula quis erat. Aenean a suscipit erat. Ut felis mi, tempus eu
//       pharetra nec, pellentesque a erat. Curabitur at pulvinar metus. Etiam id
//       dolor egestas, hendrerit turpis eget, congue orci. Duis dolor turpis,
//       tincidunt quis blandit nec, sodales sed elit. Nam eu mi sed arcu dignissim
//       cursus. Sed facilisis nunc diam, in luctus ipsum finibus ac. Vivamus
//       semper, leo tincidunt tempor vulputate, nisl lectus sollicitudin quam,
//       quis eleifend dui risus ornare ipsum. Sed quis finibus arcu. Nunc
//       ultricies nisi in imperdiet aliquam. In ullamcorper auctor sem, accumsan
//       congue magna convallis a. Maecenas vitae tempor diam, a venenatis nulla.
//       Nunc eu eleifend nibh, in imperdiet leo. Suspendisse bibendum ligula vitae
//       nisi volutpat, in hendrerit arcu sollicitudin. Phasellus placerat justo
//       elementum, pellentesque augue et, condimentum augue. Aliquam erat ex,
//       vulputate eget eros sit amet, lacinia elementum est. Morbi scelerisque
//       vestibulum libero vitae feugiat. Curabitur posuere risus sapien, ac
//       fermentum neque tristique eu. Ut erat arcu, aliquam in mauris nec, blandit
//       laoreet lacus. Proin malesuada sodales posuere. Nullam quis elementum
//       elit. Integer gravida lectus et sem imperdiet finibus. Morbi mattis vitae
//       mi sit amet tincidunt. Vestibulum vel lacinia arcu. Fusce et tempor enim.
//       Sed lobortis sollicitudin purus eget pellentesque. Vestibulum orci ante,
//       ultrices eget molestie a, maximus vitae eros. Integer at neque ut sem
//       blandit cursus non et sem. Vestibulum nec vehicula odio, et bibendum
//       lacus. Ut lacinia sapien vitae lectus cursus egestas vitae eu diam.
//       Quisque et nulla eros. Aliquam erat volutpat. Sed vitae magna ac eros
//       vestibulum cursus. Donec dapibus odio ut metus egestas, tempus dapibus
//       velit volutpat. Etiam vel dignissim libero, non lobortis nulla. Nulla
//       gravida at diam ultrices lacinia. Mauris dignissim ligula vel neque varius
//       iaculis non ac leo. Donec pretium faucibus tempus. Fusce non ornare nisi.
//       Praesent pulvinar magna justo, aliquet venenatis dolor dictum convallis.
//       Nunc posuere vitae tellus in lobortis. Nunc bibendum ac erat ac vulputate.
//       Praesent facilisis est pretium sem finibus, vel elementum justo gravida.
//       Vivamus semper euismod ligula, vitae congue felis. Curabitur volutpat
//       tristique bibendum. Interdum et malesuada fames ac ante ipsum primis in
//       faucibus. Duis quis luctus sapien. Cras sit amet cursus libero, a
//       vestibulum mauris. Maecenas neque nisi, pulvinar lacinia tempus nec,
//       venenatis at turpis. Donec in libero sit amet neque finibus egestas. Sed
//       consequat commodo arcu, vitae vulputate enim tincidunt sit amet. Integer
//       in dui pharetra, lacinia orci sit amet, lobortis ex. Ut imperdiet metus ac
//       massa interdum elementum. Ut sed ullamcorper ex. Sed justo nulla, congue
//       non tempus quis, dignissim sit amet quam. Aenean neque velit, rhoncus quis
//       vestibulum ac, vulputate commodo ipsum. Nullam in dui sagittis, suscipit
//       turpis ut, ullamcorper metus. Cras scelerisque risus malesuada augue
//       lacinia, et mollis nunc mattis. Nam mollis lorem ut felis interdum,
//       imperdiet finibus odio hendrerit. Etiam sed accumsan erat, ut dapibus
//       tortor. Nam nec metus dapibus, porttitor lectus ac, dictum ligula. Donec
//       luctus consectetur auctor. Duis a dui lacus. Vivamus sodales ultricies
//       dolor, eu tempus mi pellentesque lobortis. Quisque purus justo,
//       condimentum sit amet eros quis, sodales volutpat elit. Nam eget nunc
//       tincidunt, porta arcu ac, tempor diam. In rhoncus, ligula cursus faucibus
//       tincidunt, erat tortor finibus magna, in rhoncus elit ex vel lacus. In et
//       metus venenatis, euismod augue eget, vehicula nibh. Fusce eu ultrices
//       orci. Curabitur congue volutpat congue. Maecenas eu ante finibus,
//       porttitor nisl ut, tincidunt sapien. Praesent magna purus, ullamcorper
//       eget luctus vel, lacinia at elit. Fusce porta, neque eget ultrices
//       vestibulum, metus ipsum efficitur ante, eget hendrerit quam ligula vel
//       elit. Donec aliquam enim id faucibus finibus. Ut a hendrerit nisl.
//       Phasellus vitae arcu sit amet nunc molestie rhoncus. Nullam dapibus
//       consectetur orci, ut suscipit massa vulputate ac. Nunc sed cursus ex.
//       Nullam feugiat, nulla facilisis lobortis blandit, ipsum ipsum euismod
//       urna, at volutpat ex leo at nibh. Praesent elementum odio nec neque
//       consequat, in iaculis felis accumsan. Quisque eget gravida lectus, non
//       convallis ligula. Etiam posuere elit ac massa finibus varius. Nulla
//       blandit ligula metus, a convallis ex blandit eu. Sed eget venenatis est.
//       Nullam rhoncus mollis neque, sit amet bibendum risus aliquam eget. Duis
//       congue, justo sed vestibulum eleifend, justo sem blandit arcu, vitae
//       maximus metus mi non nulla. Praesent luctus mauris tristique vulputate
//       pharetra. Mauris mollis convallis condimentum. Mauris id pellentesque
//       mauris. Pellentesque convallis vulputate urna, ac tempor velit ornare vel.
//       Etiam ac erat sodales, feugiat ante id, condimentum elit. Morbi in nisl eu
//       dolor suscipit malesuada eget ac ex. Morbi commodo dictum ligula eu
//       tincidunt. Vivamus eleifend ligula leo, eu accumsan leo scelerisque id.
//       Morbi dapibus massa vitae malesuada pellentesque. Maecenas non erat lacus.
//       Sed rhoncus nisl vel justo malesuada pretium. Nam aliquam consectetur
//       consectetur. Maecenas ut turpis dictum, porttitor enim sit amet, vulputate
//       tellus. Proin vehicula mattis neque quis euismod. Nunc mattis volutpat
//       urna at congue. Proin eget quam scelerisque, hendrerit tortor aliquet,
//       malesuada est. Aenean velit metus, sodales non sodales eget, condimentum
//       eu ante. Sed maximus ac nisl quis commodo. Cras vel nibh at arcu interdum
//       luctus. Fusce purus arcu, convallis eget feugiat eget, luctus et sapien.
//       Sed mattis faucibus risus vitae dignissim. Mauris tempus enim sed ipsum
//       convallis, nec accumsan sem consequat.
//     </p>
//   )
// }
