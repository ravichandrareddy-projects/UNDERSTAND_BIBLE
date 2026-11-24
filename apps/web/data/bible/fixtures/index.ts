import type { ChapterContent, VerseContent } from '../types';
import { getBook } from '../books';
import { getEdition } from '../editions';

// =====================================================================
// PILOT SCRIPTURE FIXTURES (PUBLIC DOMAIN / CC BY-SA 4.0 VERBATIM)
// =====================================================================

const FIXTURES: Record<string, Record<string, VerseContent[]>> = {
  // Key format: `${bookId}_${chapterNumber}`
  // 1. GENESIS 1
  GEN_1: {
    web: [
      {
        verseNumber: 1,
        text: 'In the beginning, God created the heavens and the earth.',
        heading: 'The Creation of the World',
      },
      {
        verseNumber: 2,
        text: 'The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.',
      },
      {
        verseNumber: 3,
        text: 'God said, “Let there be light,” and there was light.',
      },
      {
        verseNumber: 4,
        text: 'God saw the light, and saw that it was good. God divided the light from the darkness.',
      },
      {
        verseNumber: 5,
        text: 'God called the light “day”, and the darkness he called “night”. There was evening and there was morning, the first day.',
      },
      {
        verseNumber: 6,
        text: 'God said, “Let there be an expanse in the middle of the waters, and let it divide the waters from the waters.”',
      },
      {
        verseNumber: 7,
        text: 'God made the expanse, and divided the waters which were under the expanse from the waters which were above the expanse; and it was so.',
      },
      {
        verseNumber: 8,
        text: 'God called the expanse “sky”. There was evening and there was morning, a second day.',
      },
      {
        verseNumber: 9,
        text: 'God said, “Let the waters under the sky be gathered together to one place, and let the dry land appear;” and it was so.',
      },
      {
        verseNumber: 10,
        text: 'God called the dry land “earth”, and the gathering together of the waters he called “seas”. God saw that it was good.',
      },
      {
        verseNumber: 11,
        text: 'God said, “Let the earth yield grass, herbs yielding seeds, and fruit trees bearing fruit after their kind, with their seeds in it, on the earth;” and it was so.',
      },
      {
        verseNumber: 12,
        text: 'The earth yielded grass, herbs yielding seed after their kind, and trees bearing fruit, with their seeds in it, after their kind; and God saw that it was good.',
      },
      {
        verseNumber: 13,
        text: 'There was evening and there was morning, a third day.',
      },
      {
        verseNumber: 14,
        text: 'God said, “Let there be lights in the expanse of sky to divide the day from the night; and let them be for signs to mark seasons, days, and years;',
      },
      {
        verseNumber: 15,
        text: 'and let them be for lights in the expanse of sky to give light on the earth;” and it was so.',
      },
      {
        verseNumber: 16,
        text: 'God made the two great lights: the greater light to rule the day, and the lesser light to rule the night. He also made the stars.',
      },
      {
        verseNumber: 17,
        text: 'God set them in the expanse of sky to give light to the earth,',
      },
      {
        verseNumber: 18,
        text: 'and to rule over the day and over the night, and to divide the light from the darkness. God saw that it was good.',
      },
      {
        verseNumber: 19,
        text: 'There was evening and there was morning, a fourth day.',
      },
      {
        verseNumber: 20,
        text: 'God said, “Let the waters abound with living creatures, and let birds fly above the earth in the open expanse of sky.”',
      },
      {
        verseNumber: 21,
        text: 'God created the large sea creatures and every living creature that moves, with which the waters swarmed, after their kind, and every winged bird after its kind. God saw that it was good.',
      },
      {
        verseNumber: 22,
        text: 'God blessed them, saying, “Be fruitful, and multiply, and fill the waters in the seas, and let birds multiply on the earth.”',
      },
      {
        verseNumber: 23,
        text: 'There was evening and there was morning, a fifth day.',
      },
      {
        verseNumber: 24,
        text: 'God said, “Let the earth produce living creatures after their kind, livestock, creeping things, and animals of the earth after their kind;” and it was so.',
      },
      {
        verseNumber: 25,
        text: 'God made the animals of the earth after their kind, and the livestock after their kind, and everything that creeps on the ground after its kind. God saw that it was good.',
      },
      {
        verseNumber: 26,
        text: 'God said, “Let’s make man in our image, after our likeness. Let them have dominion over the fish of the sea, and over the birds of the sky, and over the livestock, and over all the earth, and over every creeping thing that creeps on the earth.”',
        heading: 'The Creation of Mankind',
      },
      {
        verseNumber: 27,
        text: 'God created man in his own image. In God’s image he created him; male and female he created them.',
      },
      {
        verseNumber: 28,
        text: 'God blessed them. God said to them, “Be fruitful, multiply, fill the earth, and subdue it. Have dominion over the fish of the sea, over the birds of the sky, and over every living thing that moves on the earth.”',
      },
      {
        verseNumber: 29,
        text: 'God said, “Behold, I have given you every herb yielding seed that is on the surface of all the earth, and every tree, which bears fruit yielding seed. It will be your food.',
      },
      {
        verseNumber: 30,
        text: 'To every animal of the earth, and to every bird of the sky, and to everything that creeps on the earth, in which there is life, I have given every green herb for food;” and it was so.',
      },
      {
        verseNumber: 31,
        text: 'God saw everything that he had made, and, behold, it was very good. There was evening and there was morning, a sixth day.',
      },
    ],
    kjv: [
      {
        verseNumber: 1,
        text: 'In the beginning God created the heaven and the earth.',
        heading: 'The Creation',
      },
      {
        verseNumber: 2,
        text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
      },
      {
        verseNumber: 3,
        text: 'And God said, Let there be light: and there was light.',
      },
      {
        verseNumber: 4,
        text: 'And God saw the light, that it was good: and God divided the light from the darkness.',
      },
      {
        verseNumber: 5,
        text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.',
      },
      {
        verseNumber: 6,
        text: 'And God said, Let there be a firmament in the midst of the waters, and let it divide the waters from the waters.',
      },
      {
        verseNumber: 7,
        text: 'And God made the firmament, and divided the waters which were under the firmament from the waters which were above the firmament: and it was so.',
      },
      {
        verseNumber: 8,
        text: 'And God called the firmament Heaven. And the evening and the morning were the second day.',
      },
      {
        verseNumber: 9,
        text: 'And God said, Let the waters under the heaven be gathered together unto one place, and let the dry land appear: and it was so.',
      },
      {
        verseNumber: 10,
        text: 'And God called the dry land Earth; and the gathering together of the waters called he Seas: and God saw that it was good.',
      },
      {
        verseNumber: 11,
        text: 'And God said, Let the earth bring forth grass, the herb yielding seed, and the fruit tree yielding fruit after his kind, whose seed is in itself, upon the earth: and it was so.',
      },
      {
        verseNumber: 12,
        text: 'And the earth brought forth grass, and herb yielding seed after his kind, and the tree yielding fruit, whose seed was in itself, after his kind: and God saw that it was good.',
      },
      {
        verseNumber: 13,
        text: 'And the evening and the morning were the third day.',
      },
      {
        verseNumber: 14,
        text: 'And God said, Let there be lights in the firmament of the heaven to divide the day from the night; and let them be for signs, and for seasons, and for days, and years:',
      },
      {
        verseNumber: 15,
        text: 'And let them be for lights in the firmament of the heaven to give light upon the earth: and it was so.',
      },
      {
        verseNumber: 16,
        text: 'And God made two great lights; the greater light to rule the day, and the lesser light to rule the night: he made the stars also.',
      },
      {
        verseNumber: 17,
        text: 'And God set them in the firmament of the heaven to give light upon the earth,',
      },
      {
        verseNumber: 18,
        text: 'And to rule over the day and over the night, and to divide the light from the darkness: and God saw that it was good.',
      },
      {
        verseNumber: 19,
        text: 'And the evening and the morning were the fourth day.',
      },
      {
        verseNumber: 20,
        text: 'And God said, Let the waters bring forth abundantly the moving creature that hath life, and fowl that may fly above the earth in the open firmament of heaven.',
      },
      {
        verseNumber: 21,
        text: 'And God created great whales, and every living creature that moveth, which the waters brought forth abundantly, after their kind, and every winged fowl after his kind: and God saw that it was good.',
      },
      {
        verseNumber: 22,
        text: 'And God blessed them, saying, Be fruitful, and multiply, and fill the waters in the seas, and let fowl multiply in the earth.',
      },
      {
        verseNumber: 23,
        text: 'And the evening and the morning were the fifth day.',
      },
      {
        verseNumber: 24,
        text: 'And God said, Let the earth bring forth the living creature after his kind, cattle, and creeping thing, and beast of the earth after his kind: and it was so.',
      },
      {
        verseNumber: 25,
        text: 'And God made the beast of the earth after his kind, and cattle after their kind, and every thing that creepeth upon the earth after his kind: and God saw that it was good.',
      },
      {
        verseNumber: 26,
        text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.',
        heading: 'Creation of Man',
      },
      {
        verseNumber: 27,
        text: 'So God created man in his own image, in the image of God created he him; male and female created he them.',
      },
      {
        verseNumber: 28,
        text: 'And God blessed them, and God said unto them, Be fruitful, and multiply, and replenish the earth, and subdue it: and have dominion over the fish of the sea, and over the fowl of the air, and over every living thing that moveth upon the earth.',
      },
      {
        verseNumber: 29,
        text: 'And God said, Behold, I have given you every herb bearing seed, which is upon the face of all the earth, and every tree, in the which is the fruit of a tree yielding seed; to you it shall be for meat.',
      },
      {
        verseNumber: 30,
        text: 'And to every beast of the earth, and to every fowl of the air, and to every thing that creepeth upon the earth, wherein there is life, I have given every green herb for meat: and it was so.',
      },
      {
        verseNumber: 31,
        text: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.',
      },
    ],
    'irv-te': [
      {
        verseNumber: 1,
        text: 'ఆదియందు దేవుడు ఆకాశమును భూమిని సృజించెను.',
        heading: 'సృష్టి క్రమము',
      },
      {
        verseNumber: 2,
        text: 'భూమి నిరాకారముగాను శూన్యముగాను ఉండెను; చీకటి అగాధజలములమీద కమ్మియుండెను. దేవుని ఆత్మ జలములమీద అల్లాడుచుండెను.',
      },
      { verseNumber: 3, text: 'దేవుడు—వెలుగు కలుగును గాక అని పలుకగా వెలుగు కలిగెను.' },
      {
        verseNumber: 4,
        text: 'వెలుగు మంచిదని దేవుడు చూచెను; దేవుడు వెలుగును చీకటిని వేరుపరచెను.',
      },
      {
        verseNumber: 5,
        text: 'దేవుడు వెలుగునకు పగలనియు చీకటికి రాత్రియనియు పేరుపెట్టెను. అస్తమయమును ఉదయమును కలుగగా ఒక దినమాయెను.',
      },
      {
        verseNumber: 6,
        text: 'మరియు దేవుడు—జలముల మధ్యనొక విశాలము కలిగి జలములను జలములను వేరుపరచును గాక అని పలికెను.',
      },
      {
        verseNumber: 7,
        text: 'దేవుడు ఆ విశాలమును చేసి విశాలము క్రింది జలములను విశాలము మీది జలములను వేరుపరచగా ఆ ప్రకారమాయెను.',
      },
      {
        verseNumber: 8,
        text: 'దేవుడు ఆ విశాలమునకు ఆకాశమని పేరుపెట్టెను. అస్తమయమును ఉదయమును కలుగగా రెండవ దినమాయెను.',
      },
      {
        verseNumber: 9,
        text: 'మరియు దేవుడు—ఆకాశము క్రిందనున్న జలములన్నియు ఒకచోటనే కూర్చబడి ఆరిన నేల కనబడును గాక అని పలుకగా ఆలాగునాయెను.',
      },
      {
        verseNumber: 10,
        text: 'దేవుడు ఆరిన నేలకు భూమి అనియు, కూర్చబడిన జలములకు సముద్రములనియు పేరుపెట్టెను. అది మంచిదని దేవుడు చూచెను.',
      },
      {
        verseNumber: 11,
        text: 'దేవుడు—భూమి గడ్డిని, విత్తనములిచ్చు చెట్లను, భూమిమీద తమ తమ జాతి ప్రకారము తమలో విత్తనములుగల ఫలవృక్షములను మొలపించును గాక అని పలుకగా ఆ ప్రకారమాయెను.',
      },
      {
        verseNumber: 12,
        text: 'భూమి గడ్డిని, తమ తమ జాతి ప్రకారము విత్తనములిచ్చు చెట్లను, తమ జాతి ప్రకారము తమలో విత్తనములుగల ఫలవృక్షములను మొలపించెను. అది మంచిదని దేవుడు చూచెను.',
      },
      { verseNumber: 13, text: 'అస్తమయమును ఉదయమును కలుగగా మూడవ దినమాయెను.' },
      {
        verseNumber: 14,
        text: 'దేవుడు—పగటిని రాత్రిని వేరుపరచునట్లు ఆకాశ విశాలమందు జ్యోతులు కలుగును గాక; అవి సూచనలుగాను కాలములను దినములను సంవత్సరములను తెలియజేయునవిగాను ఉండును గాక;',
      },
      {
        verseNumber: 15,
        text: 'మరియు భూమిమీద వెలుగునిచ్చుటకు ఆకాశ విశాలమందు అవి జ్యోతులై యుండును గాక అని పలుకగా ఆ ప్రకారమాయెను.',
      },
      {
        verseNumber: 16,
        text: 'దేవుడు ఆ రెండు గొప్ప జ్యోతులను చేసెను; పగటిని ఏలుటకు పెద్ద జ్యోతిని రాత్రిని ఏలుటకు చిన్న జ్యోతిని చేసెను. మరియు నక్షత్రములను చేసెను.',
      },
      { verseNumber: 17, text: 'భూమిమీద వెలుగునిచ్చుటకును,' },
      {
        verseNumber: 18,
        text: 'పగటిని రాత్రిని ఏలుటకును, వెలుగును చీకటిని వేరుపరచుటకును దేవుడు ఆకాశ విశాలమందు వాటిని ఉంచెను. అది మంచిదని దేవుడు చూచెను.',
      },
      { verseNumber: 19, text: 'అస్తమయమును ఉదయమును కలుగగా నాల్గవ దినమాయెను.' },
      {
        verseNumber: 20,
        text: 'దేవుడు—జీవముకలిగి చలించు ప్రాణులను జలములు విస్తారముగా పుట్టించును గాక, పక్షులు భూమిపైని ఆకాశ విశాలములో ఎగురును గాక అని పలికెను.',
      },
      {
        verseNumber: 21,
        text: 'దేవుడు పెద్ద తిమింగలములను, జలములలో విస్తారముగా చలించు జీవముగల సమస్త ప్రాణులను, రెక్కలుగల ప్రతి పక్షిని వాటి వాటి జాతి ప్రకారము సృజించెను. అది మంచిదని దేవుడు చూచెను.',
      },
      {
        verseNumber: 22,
        text: 'దేవుడు వాటిని ఆశీర్వదించి—మీరు ఫలించి అభివృద్ధిపొంది సముద్ర జలములలో నిండుడి; పక్షులు భూమిమీద విస్తరించును గాక అని సెలవిచ్చెను.',
      },
      { verseNumber: 23, text: 'అస్తమయమును ఉదయమును కలుగగా ఐదవ దినమాయెను.' },
      {
        verseNumber: 24,
        text: 'దేవుడు—భూమి తన జాతి ప్రకారము జీవముగలవాటిని, అనగా పశువులను ప్రాకువాటిని భూజంతువులను వాటి వాటి జాతి ప్రకారము పుట్టించును గాక అని పలుకగా ఆ ప్రకారమాయెను.',
      },
      {
        verseNumber: 25,
        text: 'దేవుడు ఆయా జాతుల ప్రకారము అడవి జంతువులను, ఆయా జాతుల ప్రకారము పశువులను, నేలమీద ప్రాకు ప్రతి పురుగును దాని దాని జాతి ప్రకారము చేసెను. అది మంచిదని దేవుడు చూచెను.',
      },
      {
        verseNumber: 26,
        text: 'దేవుడు—మన స్వరూపమందు మన పోలికె చొప్పున నరులను చేయుదము; వారు సముద్రపు చేపలమీదను, ఆకాశ పక్షులమీదను, పశువులమీదను, సర్వభూమిమీదను, నేలమీద ప్రాకు ప్రతి పురుగుమీదను అధికారము చేయుదురు గాక అని పలికెను.',
        heading: 'నరుని సృష్టి',
      },
      {
        verseNumber: 27,
        text: 'దేవుడు తన స్వరూపమందు నరుని సృజించెను; దేవుని స్వరూపమందు వారిని సృజించెను; స్త్రీనిగాను పురుషునిగాను వారిని సృజించెను.',
      },
      {
        verseNumber: 28,
        text: 'దేవుడు వారిని ఆశీర్వదించెను; ఎట్లనగా—మీరు ఫలించి అభివృద్ధిపొంది విస్తరించి భూమిని నిండించి దానిని లోపరచుకొనుడి; సముద్రపు చేపలమీదను, ఆకాశ పక్షులమీదను, నేలమీద ప్రాకు ప్రతి జీవిమీదను అధికారము చేయుడి అని దేవుడు వారితో చెప్పెను.',
      },
      {
        verseNumber: 29,
        text: 'దేవుడు—ఇదిగో భూమియందంతటను విత్తనములిచ్చు ప్రతి చెట్టును, విత్తనములిచ్చు వృక్షఫలముగల ప్రతి వృక్షమును మీకు ఆహారముగా ఇచ్చియున్నాను.',
      },
      {
        verseNumber: 30,
        text: 'భూమిమీది సమస్త జంతువులకును, ఆకాశ పక్షులన్నిటికిని, జీవముగలదై నేలమీద ప్రాకు సమస్తమునకును పచ్చని ప్రతి చెట్టును ఆహారమగునని పలికెను; ఆ ప్రకారమాయెను.',
      },
      {
        verseNumber: 31,
        text: 'దేవుడు తాను చేసినది అంతయు చూచినప్పుడు అది మిక్కిలి మంచిదిగా ఉండెను. అస్తమయమును ఉదయమును కలుగగా ఆరవ దినమాయెను.',
      },
    ],
    'ar-svd': [
      {
        verseNumber: 1,
        text: 'فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.',
        heading: 'خلق العالم',
      },
      {
        verseNumber: 2,
        text: 'وَكَانَتِ الأَرْضُ خَرِبَةً وَخَالِيَةً، وَعَلَى وَجْهِ الْغَمْرِ ظُلْمَةٌ، وَرُوحُ اللهِ يَرِفُّ عَلَى وَجْهِ الْمِيَاهِ.',
      },
      { verseNumber: 3, text: 'وَقَالَ اللهُ: «لِيَكُنْ نُورٌ»، فَكَانَ نُورٌ.' },
      {
        verseNumber: 4,
        text: 'وَرَأَى اللهُ النُّورَ أَنَّهُ حَسَنٌ. وَفَصَلَ اللهُ بَيْنَ النُّورِ وَالظُّلْمَةِ.',
      },
      {
        verseNumber: 5,
        text: 'وَدَعَا اللهُ النُّورَ نَهَاراً، وَالظُّلْمَةُ دَعَاهَا لَيْلاً. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً وَاحِداً.',
      },
      {
        verseNumber: 6,
        text: 'وَقَالَ اللهُ: «لِيَكُنْ جَلَدٌ فِي وَسَطِ الْمِيَاهِ. وَلْيَكُنْ فَاصِلاً بَيْنَ مِيَاهٍ وَمِيَاهٍ».',
      },
      {
        verseNumber: 7,
        text: 'فَعَمِلَ اللهُ الْجَلَدَ، وَفَصَلَ بَيْنَ الْمِيَاهِ الَّتِي تَحْتَ الْجَلَدِ وَالْمِيَاهِ الَّتِي فَوْقَ الْجَلَدِ. وَكَانَ كَذَلِكَ.',
      },
      {
        verseNumber: 8,
        text: 'وَدَعَا اللهُ الْجَلَدَ سَمَاءً. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً ثَانِياً.',
      },
      {
        verseNumber: 9,
        text: 'وَقَالَ اللهُ: «لِتَجْتَمِعِ الْمِيَاهُ تَحْتَ السَّمَاءِ إِلَى مَكَانٍ وَاحِدٍ، وَلْتَظْهَرِ الْيَابِسَةُ». وَكَانَ كَذَلِكَ.',
      },
      {
        verseNumber: 10,
        text: 'وَدَعَا اللهُ الْيَابِسَةَ أَرْضاً، وَمُجْتَمَعَ الْمِيَاهِ دَعَاهُ بِحَاراً. وَرَأَى اللهُ ذَلِكَ أَنَّهُ حَسَنٌ.',
      },
      {
        verseNumber: 11,
        text: 'وَقَالَ اللهُ: «لِتُنْبِتِ الأَرْضُ عُشْباً وَبَقْلاً يُبْزِرُ بِزْراً، وَشَجَراً ذَا ثَمَرٍ يَعْمَلُ ثَمَراً كَجِنْسِهِ، بِزْرُهُ فِيهِ عَلَى الأَرْضِ». وَكَانَ كَذَلِكَ.',
      },
      {
        verseNumber: 12,
        text: 'فَأَخْرَجَتِ الأَرْضُ عُشْباً وَبَقْلاً يُبْزِرُ بِزْراً كَجِنْسِهِ، وَشَجَراً يَعْمَلُ ثَمَراً بِزْرُهُ فِيهِ كَجِنْسِهِ. وَرَأَى اللهُ ذَلِكَ أَنَّهُ حَسَنٌ.',
      },
      { verseNumber: 13, text: 'وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً ثَالِثاً.' },
      {
        verseNumber: 14,
        text: 'وَقَالَ اللهُ: «لِتَكُنْ أَنْوَارٌ فِي جَلَدِ السَّمَاءِ لِتَفْصِلَ بَيْنَ النَّهَارِ وَاللَّيْلِ، وَتَكُونَ لآيَاتٍ وَأَوْقَاتٍ وَأَيَّامٍ وَسِنِينٍ.',
      },
      {
        verseNumber: 15,
        text: 'وَتَكُونَ أَنْوَاراً فِي جَلَدِ السَّمَاءِ لِتُنِيرَ عَلَى الأَرْضِ». وَكَانَ كَذَلِكَ.',
      },
      {
        verseNumber: 16,
        text: 'فَعَمِلَ اللهُ النُّورَيْنِ الْعَظِيمَيْنِ: النُّورَ الأَكْبَرَ لِحُكْمِ النَّهَارِ، وَالنُّورَ الأَصْغَرَ لِحُكْمِ اللَّيْلِ، وَالنُّجُومَ.',
      },
      { verseNumber: 17, text: 'وَجَعَلَهَا اللهُ فِي جَلَدِ السَّمَاءِ لِتُنِيرَ عَلَى الأَرْضِ،' },
      {
        verseNumber: 18,
        text: 'وَلِتَحْكُمَ عَلَى النَّهَارِ وَاللَّيْلِ، وَلِتَفْصِلَ بَيْنَ النُّورِ وَالظُّلْمَةِ. وَرَأَى اللهُ ذَلِكَ أَنَّهُ حَسَنٌ.',
      },
      { verseNumber: 19, text: 'وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً رَابِعاً.' },
      {
        verseNumber: 20,
        text: 'وَقَالَ اللهُ: «لِتَفِضِ الْمِيَاهُ زَحَّافَاتٍ ذَاتَ نَفْسٍ حَيَّةٍ، وَلْيَطِرْ طَيْرٌ فَوْقَ الأَرْضِ عَلَى وَجْهِ جَلَدِ السَّمَاءِ».',
      },
      {
        verseNumber: 21,
        text: 'فَخَلَقَ اللهُ التَّنَانِينَ الْعِظَامَ، وَكُلَّ نَفْسٍ حَيَّةٍ تَدِبُّ الَّتِي فَاضَتْ بِهَا الْمِيَاهُ كَأَجْنَاسِهَا، وَكُلَّ طَائِرٍ ذِي جَنَاحٍ كَجِنْسِهِ. وَرَأَى اللهُ ذَلِكَ أَنَّهُ حَسَنٌ.',
      },
      {
        verseNumber: 22,
        text: 'وَبَارَكَهَا اللهُ قَائِلاً: «أَثْمِرِي وَاكْثُرِي وَامْلإِي الْمِيَاهَ فِي الْبِحَارِ. وَلْيَكْثُرِ الطَّيْرُ عَلَى الأَرْضِ».',
      },
      { verseNumber: 23, text: 'وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً خَامِساً.' },
      {
        verseNumber: 24,
        text: 'وَقَالَ اللهُ: «لِتُخْرِجِ الأَرْضُ ذَوَاتِ أَنْفُسٍ حَيَّةٍ كَجِنْسِهَا: بَهَائِمَ، وَدَبَّابَاتٍ، وَوُحُوشَ أَرْضٍ كَجِنْسِهَا». وَكَانَ كَذَلِكَ.',
      },
      {
        verseNumber: 25,
        text: 'فَعَمِلَ اللهُ وُحُوشَ الأَرْضِ كَأَجْنَاسِهَا، وَالْبَهَائِمَ كَأَجْنَاسِهَا، وَجَمِيعَ دَبَّابَاتِ الأَرْضِ كَأَجْنَاسِهَا. وَرَأَى اللهُ ذَلِكَ أَنَّهُ حَسَنٌ.',
      },
      {
        verseNumber: 26,
        text: 'وَقَالَ اللهُ: «نَعْمَلُ الإِنْسَانَ عَلَى صُورَتِنَا كَشَبَهِنَا، فَيَتَسَلَّطُونَ عَلَى سَمَكِ الْبَحْرِ وَعَلَى طَيْرِ السَّمَاءِ وَعَلَى الْبَهَائِمِ، وَعَلَى كُلِّ الأَرْضِ، وَعَلَى جَمِيعِ الدَّبَّابَاتِ الَّتِي تَدِبُّ عَلَى الأَرْضِ».',
        heading: 'خلق الإنسان',
      },
      {
        verseNumber: 27,
        text: 'فَخَلَقَ اللهُ الإِنْسَانَ عَلَى صُورَتِهِ. عَلَى صُورَةِ اللهِ خَلَقَهُ. ذَكَراً وَأُنْثَى خَلَقَهُمْ.',
      },
      {
        verseNumber: 28,
        text: 'وَبَارَكَهُمُ اللهُ وَقَالَ لَهُمْ: «أَثْمِرُوا وَاكْثُرُوا وَامْلأُوا الأَرْضَ، وَأَخْضِعُوهَا، وَتَسَلَّطُوا عَلَى سَمَكِ الْبَحْرِ وَعَلَى طَيْرِ السَّمَاءِ وَعَلَى كُلِّ حَيَوَانٍ يَدِبُّ عَلَى الأَرْضِ».',
      },
      {
        verseNumber: 29,
        text: 'وَقَالَ اللهُ: «إِنِّي قَدْ أَعْطَيْتُكُمْ كُلَّ بَقْلٍ يُبْزِرُ بِزْراً عَلَى وَجْهِ كُلِّ الأَرْضِ، وَكُلَّ شَجَرٍ فِيهِ ثَمَرُ شَجَرٍ يُبْزِرُ بِزْراً لَكُمْ يَكُونُ طَعَاماً.',
      },
      {
        verseNumber: 30,
        text: 'وَلِكُلِّ حَيَوَانِ الأَرْضِ وَكُلِّ طَيْرِ السَّمَاءِ وَكُلِّ دَبَّابَةٍ عَلَى الأَرْضِ فِيهَا نَفْسٌ حَيَّةٌ، أَعْطَيْتُ كُلَّ عُشْبٍ أَخْضَرَ طَعَاماً». وَكَانَ كَذَلِكَ.',
      },
      {
        verseNumber: 31,
        text: 'وَرَأَى اللهُ كُلَّ مَا عَمِلَهُ فَإِذَا هُوَ حَسَنٌ جِدّاً. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً سَادِساً.',
      },
    ],
  },

  // 2. JOHN 1
  JHN_1: {
    web: [
      {
        verseNumber: 1,
        text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        heading: 'The Incarnation of the Word',
      },
      { verseNumber: 2, text: 'The same was in the beginning with God.' },
      {
        verseNumber: 3,
        text: 'All things were made through him. Without him was not anything made that has been made.',
      },
      {
        verseNumber: 4,
        text: 'In him was life, and the life was the light of men.',
      },
      {
        verseNumber: 5,
        text: 'The light shines in the darkness, and the darkness hasn’t overcome it.',
      },
      {
        verseNumber: 6,
        text: 'There came a man, sent from God, whose name was John.',
      },
      {
        verseNumber: 7,
        text: 'The same came as a witness, that he might testify about the light, that all might believe through him.',
      },
      {
        verseNumber: 8,
        text: 'He was not the light, but was sent that he might testify about the light.',
      },
      {
        verseNumber: 9,
        text: 'The true light that enlightens everyone was coming into the world.',
      },
      {
        verseNumber: 10,
        text: 'He was in the world, and the world was made through him, and the world didn’t recognize him.',
      },
      {
        verseNumber: 11,
        text: 'He came to his own, and those who were his own didn’t receive him.',
      },
      {
        verseNumber: 12,
        text: 'But as many as received him, to them he gave the right to become God’s children, to those who believe in his name:',
      },
      {
        verseNumber: 13,
        text: 'who were born not of blood, nor of the will of the flesh, nor of the will of man, but of God.',
      },
      {
        verseNumber: 14,
        text: 'The Word became flesh, and lived among us. We saw his glory, such glory as of the one and only Son of the Father, full of grace and truth.',
      },
      {
        verseNumber: 15,
        text: 'John testified about him. He cried out, saying, “This was he of whom I said, ‘He who comes after me has surpassed me, for he was before me.’”',
      },
      {
        verseNumber: 16,
        text: 'From his fullness we all received grace upon grace.',
      },
      {
        verseNumber: 17,
        text: 'For the law was given through Moses. Grace and truth were realized through Jesus Christ.',
      },
      {
        verseNumber: 18,
        text: 'No one has seen God at any time. The one and only Son, who is in the bosom of the Father, he has declared him.',
      },
    ],
    kjv: [
      {
        verseNumber: 1,
        text: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        heading: 'The Word Made Flesh',
      },
      { verseNumber: 2, text: 'The same was in the beginning with God.' },
      {
        verseNumber: 3,
        text: 'All things were made by him; and without him was not any thing made that was made.',
      },
      {
        verseNumber: 4,
        text: 'In him was life; and the life was the light of men.',
      },
      {
        verseNumber: 5,
        text: 'And the light shineth in darkness; and the darkness comprehended it not.',
      },
      {
        verseNumber: 6,
        text: 'There was a man sent from God, whose name was John.',
      },
      {
        verseNumber: 7,
        text: 'The same came for a witness, to bear witness of the Light, that all men through him might believe.',
      },
      {
        verseNumber: 8,
        text: 'He was not that Light, but was sent to bear witness of that Light.',
      },
      {
        verseNumber: 9,
        text: 'That was the true Light, which lighteth every man that cometh into the world.',
      },
      {
        verseNumber: 10,
        text: 'He was in the world, and the world was made by him, and the world knew him not.',
      },
      {
        verseNumber: 11,
        text: 'He came unto his own, and his own received him not.',
      },
      {
        verseNumber: 12,
        text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:',
      },
      {
        verseNumber: 13,
        text: 'Which were born, not of blood, nor of the will of the flesh, nor of the will of man, but of God.',
      },
      {
        verseNumber: 14,
        text: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
      },
      {
        verseNumber: 15,
        text: 'John bare witness of him, and cried, saying, This was he of whom I spake, He that cometh after me is preferred before me: for he was before me.',
      },
      {
        verseNumber: 16,
        text: 'And of his fulness have all we received, and grace for grace.',
      },
      {
        verseNumber: 17,
        text: 'For the law was given by Moses, but grace and truth came by Jesus Christ.',
      },
      {
        verseNumber: 18,
        text: 'No man hath seen God at any time; the only begotten Son, which is in the bosom of the Father, he hath declared him.',
      },
    ],
    'irv-te': [
      {
        verseNumber: 1,
        text: 'ఆదియందు వాక్యము ఉండెను, వాక్యము దేవునియొద్ద ఉండెను, వాక్యము దేవుడై యుండెను.',
        heading: 'వాక్యము శరీరధారియగుట',
      },
      { verseNumber: 2, text: 'ఆయన ఆదియందు దేవునియొద్ద ఉండెను.' },
      {
        verseNumber: 3,
        text: 'సమస్తమును ఆయన మూలముగా కలిగెను; కలిగియున్నదేదియు ఆయన లేకుండ కలుగలేదు.',
      },
      {
        verseNumber: 4,
        text: 'ఆయనలో జీవము ఉండెను; ఆ జీవము మనుష్యులకు వెలుగై యుండెను.',
      },
      {
        verseNumber: 5,
        text: 'ఆ వెలుగు చీకటిలో ప్రకాశించుచున్నది గాని చీకటి దాని గ్రహింపకుండెను.',
      },
      {
        verseNumber: 6,
        text: 'దేవునియొద్దనుండి పంపబడిన యొక మనుష్యుడు ఉండెను; అతని పేరు యోహాను.',
      },
      {
        verseNumber: 7,
        text: 'అతని మూలముగా అందరు విశ్వసించునట్లు, అతడు ఆ వెలుగునుగూర్చి సాక్ష్యమిచ్చుటకు సాక్షిగా వచ్చెను.',
      },
      {
        verseNumber: 8,
        text: 'అతడు ఆ వెలుగు కాదు గాని ఆ వెలుగునుగూర్చి సాక్ష్యమిచ్చుటకు వచ్చినవాడు.',
      },
      {
        verseNumber: 9,
        text: 'నిజమైన వెలుగు ఉండెను; అది లోకములోనికి వచ్చుచు ప్రతి మనుష్యుని వెలిగించుచున్నది.',
      },
      {
        verseNumber: 10,
        text: 'ఆయన లోకములో ఉండెను, లోకమాయన మూలముగా కలిగెను గాని లోకమాయనను ఎరుగలేదు.',
      },
      {
        verseNumber: 11,
        text: 'ఆయన తన స్వకీయులయొద్దకు వచ్చెను; ఆయన స్వకీయులు ఆయనను చేర్చుకొనలేదు.',
      },
      {
        verseNumber: 12,
        text: 'తన్ను ఎందరంగీకరించిరో, అనగా తన నామమందు విశ్వాసముంచినవారికి, దేవుని పిల్లలగుటకు ఆయన అధికారము ఇచ్చెను.',
      },
      {
        verseNumber: 13,
        text: 'వారు రక్తమువలననైనను శరీరేచ్ఛవలననైనను మనుష్యేచ్ఛవలననైనను పుట్టక దేవునివలన పుట్టినవారే.',
      },
      {
        verseNumber: 14,
        text: 'ఆ వాక్యము శరీరధారియై, కృపాసత్యసంపూర్ణుడుగా మనమధ్య నివసించెను; తండ్రివలన కలిగిన అద్వితీయకుమారుని మహిమవలె మనము ఆయన మహిమను కనుగొంటిమి.',
      },
      {
        verseNumber: 15,
        text: 'యోహాను ఆయననుగూర్చి సాక్ష్యమిచ్చుచు—నా వెనుక వచ్చువాడు నాకంటె ప్రముఖుడు, ఆయన నాకంటె మునుపు ఉండినవాడు గనుక నాకంటె ఘనుడాయెనని నేను చెప్పినవాడు ఈయనే అని ఎలుగెత్తి చెప్పెను.',
      },
      { verseNumber: 16, text: 'ఆయన పరిపూర్ణతలోనుండి మనమందరము కృపమీద కృపను పొందితిమి.' },
      {
        verseNumber: 17,
        text: 'ధర్మశాస్త్రము మోషేద్వారా ఇవ్వబడెను; కృపయు సత్యమును యేసుక్రీస్తుద్వారా కలిగెను.',
      },
      {
        verseNumber: 18,
        text: 'ఎవడును ఎప్పుడైనను దేవుని చూడలేదు; తండ్రి రొమ్ముననున్న అద్వితీయకుమారుడే ఆయనను బయలుపరచెను.',
      },
    ],
    'ar-svd': [
      {
        verseNumber: 1,
        text: 'فِي الْبَدْءِ كَانَ الْكَلِمَةُ، وَالْكَلِمَةُ كَانَ عِنْدَ اللهِ، وَكَانَ الْكَلِمَةُ اللهَ.',
        heading: 'تجسد الكلمة',
      },
      { verseNumber: 2, text: 'هَذَا كَانَ فِي الْبَدْءِ عِنْدَ اللهِ.' },
      { verseNumber: 3, text: 'كُلُّ شَيْءٍ بِهِ كَانَ، وَبِغَيْرِهِ لَمْ يَكُنْ شَيْءٌ مِمَّا كَانَ.' },
      { verseNumber: 4, text: 'فِيهِ كَانَتِ الْحَيَاةُ، وَالْحَيَاةُ كَانَتْ نُورَ النَّاسِ،' },
      { verseNumber: 5, text: 'وَالنُّورُ يُضِيءُ فِي الظُّلْمَةِ، وَالظُّلْمَةُ لَمْ تُدْرِكْهُ.' },
      { verseNumber: 6, text: 'كَانَ إِنْسَانٌ مُرْسَلٌ مِنَ اللهِ اسْمُهُ يُوحَنَّا.' },
      {
        verseNumber: 7,
        text: 'هَذَا جَاءَ لِلشَّهَادَةِ لِيَشْهَدَ لِلنُّورِ، لِكَيْ يُؤْمِنَ الْكُلُّ بِوَاسِطَتِهِ.',
      },
      { verseNumber: 8, text: 'لَمْ يَكُنْ هُوَ النُّورَ، بَلْ لِيَشْهَدَ لِلنُّورِ.' },
      {
        verseNumber: 9,
        text: 'كَانَ النُّورُ الْحَقِيقِيُّ الَّذِي يُنِيرُ كُلَّ إِنْسَانٍ آتِياً إِلَى الْعَالَمِ.',
      },
      {
        verseNumber: 10,
        text: 'كَانَ فِي الْعَالَمِ، وَكُوِّنَ الْعَالَمُ بِهِ، وَلَمْ يَعْرِفْهُ الْعَالَمُ.',
      },
      { verseNumber: 11, text: 'إِلَى خَاصَّتِهِ جَاءَ، وَخَاصَّتُهُ لَمْ تَقْبَلْهُ.' },
      {
        verseNumber: 12,
        text: 'وَأَمَّا كُلُّ الَّذِينَ قَبِلُوهُ فَأَعْطَاهُمْ سُلْطَاناً أَنْ يَصِيرُوا أَوْلاَدَ اللهِ، أَيِ الْمُؤْمِنُونَ بِاسْمِهِ.',
      },
      {
        verseNumber: 13,
        text: 'اَلَّذِينَ وُلِدُوا لَيْسَ مِنْ دَمٍ، وَلاَ مِنْ مَشِيئَةِ جَسَدٍ، وَلاَ مِنْ مَشِيئَةِ رَجُلٍ، بَلْ مِنَ اللهِ.',
      },
      {
        verseNumber: 14,
        text: 'وَالْكَلِمَةُ صَارَ جَسَداً وَحَلَّ بَيْنَنَا، وَرَأَيْنَا مَجْدَهُ، مَجْداً كَمَا لِوَحِيدٍ مِنَ الآبِ، مَمْلُوءاً نِعْمَةً وَحَقّاً.',
      },
      {
        verseNumber: 15,
        text: 'يُوحَنَّا شَهِدَ لَهُ وَنَادَى: «هَذَا هُوَ الَّذِي قُلْتُ عَنْهُ: إِنَّ الَّذِي يَأْتِي بَعْدِي صَارَ قُدَّامِي، لأَنَّهُ كَانَ قَبْلِي».',
      },
      { verseNumber: 16, text: 'وَمِنْ مِلْئِهِ نَحْنُ جَمِيعاً أَخَذْنَا، وَنِعْمَةً فَوْقَ نِعْمَةٍ.' },
      {
        verseNumber: 17,
        text: 'لأَنَّ النَّامُوسَ بِمُوسَى أُعْطِيَ، أَمَّا النِّعْمَةُ وَالْحَقُّ فَبِيَسُوعَ الْمَسِيحِ صَارَا.',
      },
      {
        verseNumber: 18,
        text: 'اَللهُ لَمْ يَرَهُ أَحَدٌ قَطُّ. اَلاِبْنُ الْوَحِيدُ الَّذِي هُوَ فِي حِضْنِ الآبِ هُوَ خَبَّرَ.',
      },
    ],
  },

  // 3. JOHN 3
  JHN_3: {
    web: [
      {
        verseNumber: 1,
        text: 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.',
        heading: 'Nicodemus Visits Jesus',
      },
      {
        verseNumber: 2,
        text: 'The same came to him by night, and said to him, “Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do, unless God is with him.”',
      },
      {
        verseNumber: 3,
        text: 'Jesus answered him, “Most certainly, I tell you, unless one is born anew, he can’t see God’s Kingdom.”',
      },
      {
        verseNumber: 4,
        text: 'Nicodemus said to him, “How can a man be born when he is old? Can he enter a second time into his mother’s womb, and be born?”',
      },
      {
        verseNumber: 5,
        text: 'Jesus answered, “Most certainly I tell you, unless one is born of water and spirit, he can’t enter into God’s Kingdom.',
      },
      {
        verseNumber: 6,
        text: 'That which is born of the flesh is flesh. That which is born of the Spirit is spirit.',
      },
      {
        verseNumber: 7,
        text: 'Don’t marvel that I said to you, ‘You must be born anew.’',
      },
      {
        verseNumber: 8,
        text: 'The wind blows where it wants to, and you hear its sound, but don’t know where it comes from and where it is going. So is everyone who is born of the Spirit.”',
      },
      {
        verseNumber: 9,
        text: 'Nicodemus answered him, “How can these things be?”',
      },
      {
        verseNumber: 10,
        text: 'Jesus answered him, “Are you the teacher of Israel, and don’t understand these things?',
      },
      {
        verseNumber: 11,
        text: 'Most certainly I tell you, we speak that which we know, and testify of that which we have seen, and you don’t receive our witness.',
      },
      {
        verseNumber: 12,
        text: 'If I told you earthly things and you don’t believe, how will you believe if I tell you heavenly things?',
      },
      {
        verseNumber: 13,
        text: 'No one has ascended into heaven, but he who descended out of heaven, the Son of Man, who is in heaven.',
      },
      {
        verseNumber: 14,
        text: 'As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,',
      },
      {
        verseNumber: 15,
        text: 'that whoever believes in him should not perish, but have eternal life.',
      },
      {
        verseNumber: 16,
        text: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.',
        heading: 'God So Loved the World',
      },
      {
        verseNumber: 17,
        text: 'For God didn’t send his Son into the world to judge the world, but that the world should be saved through him.',
      },
      {
        verseNumber: 18,
        text: 'He who believes in him is not judged. He who doesn’t believe has been judged already, because he has not believed in the name of the one and only Son of God.',
      },
      {
        verseNumber: 19,
        text: 'This is the judgment, that the light has come into the world, and men loved the darkness rather than the light; for their works were evil.',
      },
      {
        verseNumber: 20,
        text: 'For everyone who does evil hates the light, and doesn’t come to the light, lest his works would be exposed.',
      },
      {
        verseNumber: 21,
        text: 'But he who does the truth comes to the light, that his works may be revealed, that they have been done in God.”',
      },
    ],
    kjv: [
      {
        verseNumber: 1,
        text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:',
        heading: 'Nicodemus Cometh to Jesus',
      },
      {
        verseNumber: 2,
        text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.',
      },
      {
        verseNumber: 3,
        text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.',
      },
      {
        verseNumber: 4,
        text: 'Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother’s womb, and be born?',
      },
      {
        verseNumber: 5,
        text: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.',
      },
      {
        verseNumber: 6,
        text: 'That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.',
      },
      {
        verseNumber: 7,
        text: 'Marvel not that I said unto thee, Ye must be born again.',
      },
      {
        verseNumber: 8,
        text: 'The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.',
      },
      {
        verseNumber: 9,
        text: 'Nicodemus answered and said unto him, How can these things be?',
      },
      {
        verseNumber: 10,
        text: 'Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?',
      },
      {
        verseNumber: 11,
        text: 'Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.',
      },
      {
        verseNumber: 12,
        text: 'If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?',
      },
      {
        verseNumber: 13,
        text: 'And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.',
      },
      {
        verseNumber: 14,
        text: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:',
      },
      {
        verseNumber: 15,
        text: 'That whosoever believeth in him should not perish, but have eternal life.',
      },
      {
        verseNumber: 16,
        text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        heading: 'The Love of God',
      },
      {
        verseNumber: 17,
        text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
      },
      {
        verseNumber: 18,
        text: 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.',
      },
      {
        verseNumber: 19,
        text: 'And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.',
      },
      {
        verseNumber: 20,
        text: 'For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.',
      },
      {
        verseNumber: 21,
        text: 'But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.',
      },
    ],
    'irv-te': [
      {
        verseNumber: 1,
        text: 'యూదుల అధికారియైన నికొదేమను పరిసయ్యుడొకడుండెను.',
        heading: 'నికొదేము దర్శనము',
      },
      {
        verseNumber: 2,
        text: 'అతడు రాత్రివేళ ఆయనయొద్దకు వచ్చి—బోధకుడా, దేవుడు తోడైయుంటేనే గాని నీవు చేయుచున్న యీ సూచకక్రియలను ఎవడును చేయనేరడు; కాబట్టి నీవు దేవునియొద్దనుండి వచ్చిన బోధకుడవని మేము ఎరుగుదుమని ఆయనతో చెప్పెను.',
      },
      {
        verseNumber: 3,
        text: 'యేసు అతనితో—ఒకడు క్రొత్తగా జన్మించితేనే గాని అతడు దేవుని రాజ్యమును చూడలేడని నీతో నిశ్చయముగా చెప్పుచున్నాననెను.',
      },
      {
        verseNumber: 4,
        text: 'నికొదేము—ముసలివాడైన మనుష్యుడు ఎట్లు జన్మింపగలడు? అతడు తల్లి గర్భమందు రెండవమారు ప్రవేశించి జన్మింపగలడా? అని ఆయనను అడిగెను.',
      },
      {
        verseNumber: 5,
        text: 'యేసు ఇట్లనెను—ఒకడు నీటిమూలముగాను ఆత్మమూలముగాను జన్మించితేనే గాని దేవుని రాజ్యములో ప్రవేశింపలేడని నీతో నిశ్చయముగా చెప్పుచున్నాను.',
      },
      {
        verseNumber: 6,
        text: 'శరీరమూలముగా జన్మించినది శరీరమును, ఆత్మమూలముగా జన్మించినది ఆత్మయునై యున్నది.',
      },
      {
        verseNumber: 7,
        text: 'మీరు క్రొత్తగా జన్మింపవలెనని నేను నీతో చెప్పినందుకు ఆశ్చర్యపడవద్దు.',
      },
      {
        verseNumber: 8,
        text: 'గాలి తనకిష్టము వచ్చినచోట విసరును; నీవు దాని శబ్దము విందువు గాని అది ఎక్కడనుండి వచ్చునో ఎక్కడికి పోవునో నీకు తెలియదు; ఆత్మమూలముగా జన్మించిన ప్రతివాడును ఆలాగే యున్నాడు.',
      },
      {
        verseNumber: 9,
        text: 'అందుకు నికొదేము—ఈ సంగతులు ఎట్లు జరుగునని ఆయనను అడుగగా,',
      },
      {
        verseNumber: 10,
        text: 'యేసు ఇట్లనెను—నీవు ఇశ్రాయేలునకు బోధకుడవై యుండియు వీటిని ఎరుగవా?',
      },
      {
        verseNumber: 11,
        text: 'మేము ఎరిగిన సంగతియే చెప్పుచున్నాము, చూచిన సంగతికే సాక్ష్యమిచ్చుచున్నాము గాని మా సాక్ష్యము మీరు అంగీకరింపరని నీతో నిశ్చయముగా చెప్పుచున్నాను.',
      },
      {
        verseNumber: 12,
        text: 'భూసంబంధమైన సంగతులు నేను మీతో చెపితే మీరు నమ్మకున్నప్పుడు, పరలోకసంబంధమైన సంగతులు మీతో చెప్పినయెడల ఎట్లు నమ్ముదురు?',
      },
      {
        verseNumber: 13,
        text: 'మరియు పరలోకమునుండి దిగివచ్చిన మనుష్యకుమారుడే తప్ప పరలోకమునకు ఎక్కిపోయినవాడెవడును లేడు.',
      },
      {
        verseNumber: 14,
        text: 'అరణ్యములో మోషే సర్పమును ఏలాగు ఎత్తెనో, ఆలాగే మనుష్యకుమారుడును ఎత్తబడవలెను;',
      },
      {
        verseNumber: 15,
        text: 'ఆయనయందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయన ఎత్తబడవలెను.',
      },
      {
        verseNumber: 16,
        text: 'దేవుడు లోకమును ఎంతో ప్రేమించెను. కాగా ఆయన తన అద్వితీయకుమారునిగా పుట్టిన వానియందు విశ్వాసముంచు ప్రతివాడును నశింపక నిత్యజీవము పొందునట్లు ఆయనను అనుగ్రహించెను.',
        heading: 'దేవుని అపారమైన ప్రేమ',
      },
      {
        verseNumber: 17,
        text: 'లోకము తన కుమారునిద్వారా రక్షణ పొందుటకే గాని లోకమునకు తీర్పు తీర్చుటకు దేవుడు ఆయనను లోకములోనికి పంపలేదు.',
      },
      {
        verseNumber: 18,
        text: 'ఆయనయందు విశ్వాసముంచువానికి తీర్పు తీర్చబడదు; విశ్వసింపనివాడు దేవుని అద్వితీయకుమారుని నామమందు విశ్వాసముంచలేదు గనుక వానికి ఇప్పటికే తీర్పు తీరియున్నది.',
      },
      {
        verseNumber: 19,
        text: 'ఆ తీర్పు ఇదే; వెలుగు లోకములోనికి వచ్చెను గాని తమ క్రియలు చెడ్డవైనందున మనుష్యులు వెలుగును ప్రేమింపక చీకటినే ప్రేమించిరి.',
      },
      {
        verseNumber: 20,
        text: 'దుష్కార్యము చేయు ప్రతివాడు వెలుగును ద్వేషించును, తన క్రియలు ప్రత్యక్షపరచబడకుండునట్లు వెలుగునొద్దకు రాడు.',
      },
      {
        verseNumber: 21,
        text: 'సత్యవర్తనుడైతే తన క్రియలు దేవుని మూలముగా చేయబడియున్నవని ప్రత్యక్షపరచబడునట్లు వెలుగునొద్దకు వచ్చును.',
      },
    ],
    'ar-svd': [
      {
        verseNumber: 1,
        text: 'كَانَ إِنْسَانٌ مِنَ الْفَرِّيسِيِّينَ اسْمُهُ نِيقُودِيمُوسُ، رَئِيسٌ لِلْيَهُودِ.',
        heading: 'يسوع ونيقوديموس',
      },
      {
        verseNumber: 2,
        text: 'هَذَا جَاءَ إِلَى يَسُوعَ لَيْلاً وَقَالَ لَهُ: «يَا مُعَلِّمُ، نَعْلَمُ أَنَّكَ قَدْ أَتَيْتَ مِنَ اللهِ مُعَلِّماً، لأَنَّ لَيْسَ أَحَدٌ يَقْدِرُ أَنْ يَعْمَلَ هَذِهِ الآيَاتِ الَّتِي أَنْتَ تَعْمَلُ إِنْ لَمْ يَكُنِ اللهُ مَعَهُ».',
      },
      {
        verseNumber: 3,
        text: 'أَجَابَ يَسُوعُ: «الْحَقَّ الْحَقَّ أَقُولُ لَكَ: إِنْ كَانَ أَحَدٌ لاَ يُولَدُ مِنْ فَوْقُ لاَ يَقْدِرُ أَنْ يَرَى مَلَكُوتَ اللهِ».',
      },
      {
        verseNumber: 4,
        text: 'قَالَ لَهُ نِيقُودِيمُوسُ: «كَيْفَ يُمْكِنُ الإِنْسَانَ أَنْ يُولَدَ وَهُوَ شَيْخٌ؟ أَلَعَلَّهُ يَقْدِرُ أَنْ يَدْخُلَ بَطْنَ أُمِّهِ ثَانِيَةً وَيُولَدَ؟»',
      },
      {
        verseNumber: 5,
        text: 'أَجَابَ يَسُوعُ: «الْحَقَّ الْحَقَّ أَقُولُ لَكَ: إِنْ كَانَ أَحَدٌ لاَ يُولَدُ مِنَ الْمَاءِ وَالرُّوحِ لاَ يَقْدِرُ أَنْ يَدْخُلَ مَلَكُوتَ اللهِ.',
      },
      {
        verseNumber: 6,
        text: 'اَلْمَوْلُودُ مِنَ الْجَسَدِ جَسَدٌ هُوَ، وَالْمَوْلُودُ مِنَ الرُّوحِ هُوَ رُوحٌ.',
      },
      { verseNumber: 7, text: 'لاَ تَتَعَجَّبْ أَنِّي قُلْتُ لَكَ: يَنْبَغِي أَنْ تُولَدُوا مِنْ فَوْقُ.' },
      {
        verseNumber: 8,
        text: 'اَلرِّيحُ تَهُبُّ حَيْثُ تَشَاءُ، وَتَسْمَعُ صَوْتَهَا، لكِنَّكَ لاَ تَعْلَمُ مِنْ أَيْنَ تَأْتِي وَلاَ إِلَى أَيْنَ تَذْهَبُ. هكَذَا كُلُّ مَنْ وُلِدَ مِنَ الرُّوحِ».',
      },
      { verseNumber: 9, text: 'أَجَابَ نِيقُودِيمُوسُ: «كَيْفَ يُمْكِنُ أَنْ يَكُونَ هَذَا؟»' },
      { verseNumber: 10, text: 'أَجَابَ يَسُوعُ: «أَنْتَ مُعَلِّمُ إِسْرَائِيلَ وَلَسْتَ تَعْلَمُ هَذَا!' },
      {
        verseNumber: 11,
        text: 'اَلْحَقَّ الْحَقَّ أَقُولُ لَكَ: إِنَّنَا إِنَّمَا نَتَكَلَّمُ بِمَا نَعْلَمُ وَنَشْهَدُ بِمَا رَأَيْنَا، وَلَسْتُمْ تَقْبَلُونَ شَهَادَتَنَا.',
      },
      {
        verseNumber: 12,
        text: 'إِنْ كُنْتُ قُلْتُ لَكُمُ الأَرْضِيَّاتِ وَلَسْتُمْ تُؤْمِنُونَ، فَكَيْفَ تُؤْمِنُونَ إِنْ قُلْتُ لَكُمُ السَّمَاوِيَّاتِ؟',
      },
      {
        verseNumber: 13,
        text: 'وَلَيْسَ أَحَدٌ صَعِدَ إِلَى السَّمَاءِ إِلاَّ الَّذِي نَزَلَ مِنَ السَّمَاءِ، ابْنُ الإِنْسَانِ الَّذِي هُوَ فِي السَّمَاءِ.',
      },
      {
        verseNumber: 14,
        text: '«وَكَمَا رَفَعَ مُوسَى الْحَيَّةَ فِي الْبَرِّيَّةِ هكَذَا يَنْبَغِي أَنْ يُرْفَعَ ابْنُ الإِنْسَانِ،',
      },
      {
        verseNumber: 15,
        text: 'لِكَيْ لاَ يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ بَلْ تَكُونُ لَهُ الْحَيَاةُ الأَبَدِيَّةُ.',
      },
      {
        verseNumber: 16,
        text: 'لأَنَّهُ هكَذَا أَحَبَّ اللهُ الْعَالَمَ حَتَّى بَذَلَ ابْنَهُ الْوَحِيدَ، لِكَيْ لاَ يَهْلِكَ كُلُّ مَنْ يُؤْمِنُ بِهِ، بَلْ تَكُونُ لَهُ الْحَيَاةُ الأَبَدِيَّةُ.',
        heading: 'محبة الله للعالم',
      },
      {
        verseNumber: 17,
        text: 'لأَنَّهُ لَمْ يُرْسِلِ اللهُ ابْنَهُ إِلَى الْعَالَمِ لِيَدِينَ الْعَالَمَ، بَلْ لِيَخْلُصَ بِهِ الْعَالَمُ.',
      },
      {
        verseNumber: 18,
        text: 'اَلَّذِي يُؤْمِنُ بِهِ لاَ يُدَانُ، وَالَّذِي لاَ يُؤْمِنُ قَدْ دِينَ، لأَنَّهُ لَمْ يُؤْمِنْ بِاسْمِ ابْنِ اللهِ الْوَحِيدِ.',
      },
      {
        verseNumber: 19,
        text: 'وَهذِهِ هِيَ الدَّيْنُونَةُ: إِنَّ النُّورَ قَدْ جَاءَ إِلَى الْعَالَمِ، وَأَحَبَّ النَّاسُ الظُّلْمَةَ أَكْثَرَ مِنَ النُّورِ، لأَنَّ أَعْمَالَهُمْ كَانَتْ شِرِّيرَةً.',
      },
      {
        verseNumber: 20,
        text: 'لأَنَّ كُلَّ مَنْ يَعْمَلُ السَّيِّآتِ يُبْغِضُ النُّورَ، وَلاَ يَأْتِي إِلَى النُّورِ لِئَلاَّ تُوَبَّخَ أَعْمَالُهُ.',
      },
      {
        verseNumber: 21,
        text: 'وَأَمَّا مَنْ يَفْعَلُ الْحَقَّ فَيُقْبِلُ إِلَى النُّورِ، لِكَيْ تَظْهَرَ أَعْمَالُهُ أَنَّهَا بِاللهِ مَعْمُولَةٌ».',
      },
    ],
  },

  // 4. PSALM 23
  PSA_23: {
    web: [
      {
        verseNumber: 1,
        text: 'Yahweh is my shepherd: I shall lack nothing.',
        heading: 'The Lord Is My Shepherd',
      },
      {
        verseNumber: 2,
        text: 'He makes me lie down in green pastures. He leads me beside still waters.',
      },
      {
        verseNumber: 3,
        text: 'He restores my soul. He guides me in the paths of righteousness for his name’s sake.',
      },
      {
        verseNumber: 4,
        text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me. Your rod and your staff, they comfort me.',
      },
      {
        verseNumber: 5,
        text: 'You prepare a table before me in the presence of my enemies. You anoint my head with oil. My cup runs over.',
      },
      {
        verseNumber: 6,
        text: 'Surely goodness and loving kindness shall follow me all the days of my life, and I will dwell in Yahweh’s house forever.',
      },
    ],
    kjv: [
      {
        verseNumber: 1,
        text: 'The LORD is my shepherd; I shall not want.',
        heading: 'A Psalm of David',
      },
      {
        verseNumber: 2,
        text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
      },
      {
        verseNumber: 3,
        text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name’s sake.',
      },
      {
        verseNumber: 4,
        text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.',
      },
      {
        verseNumber: 5,
        text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.',
      },
      {
        verseNumber: 6,
        text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.',
      },
    ],
    'irv-te': [
      {
        verseNumber: 1,
        text: 'యెహోవా నా కాపరి; నాకు లేమి కలుగదు.',
        heading: 'దావీదు కీర్తన',
      },
      {
        verseNumber: 2,
        text: 'పచ్చికగల చోట్లను ఆయన నన్ను పరుండజేయుచున్నాడు; శాంతికరమైన జలములయొద్ద నన్ను నడిపించుచున్నాడు.',
      },
      {
        verseNumber: 3,
        text: 'నా ప్రాణమునకు ఆయన సేదదీర్చుచున్నాడు; తన నామమునుబట్టి నన్ను నీతిమార్గములలో నడిపించుచున్నాడు.',
      },
      {
        verseNumber: 4,
        text: 'గాఢాంధకారపు లోయలో నేను నడచినను ఏ అపాయమునకు భయపడను, నీవు నాకు తోడైయుందువు; నీ దుడ్డుకఱ్ఱయు నీ దండమును నన్ను ఆదరించును.',
      },
      {
        verseNumber: 5,
        text: 'నా శత్రువులయెదుట నీవు నాకు భోజనము సిద్ధపరచుదువు; నూనెతో నా తల అంటియున్నావు, నా గిన్నె నిండి పొర్లుచున్నది.',
      },
      {
        verseNumber: 6,
        text: 'నేను బ్రదుకు దినములన్నియు కృపాక్షేమములే నా వెంట వచ్చును; చిరకాలము యెహోవా మందిరములో నేను నివాసము చేసెదను.',
      },
    ],
    'ar-svd': [
      {
        verseNumber: 1,
        text: 'اَلرَّبُّ رَاعِيَّ فَلاَ يُعْوِزُنِي شَيْءٌ.',
        heading: 'مزمور لداود',
      },
      { verseNumber: 2, text: 'فِي مَرَاعٍ خُضْرٍ يُرْبِضُنِي. إِلَى مِيَاهِ الرَّاحَةِ يُورِدُنِي.' },
      { verseNumber: 3, text: 'يَرُدُّ نَفْسِي. يَهْدِينِي إِلَى سُبُلِ الْبِرِّ مِنْ أَجْلِ اسْمِهِ.' },
      {
        verseNumber: 4,
        text: 'أَيْضاً إِذَا سِرْتُ فِي وَادِي ظِلِّ الْمَوْتِ لاَ أَخَافُ شَرّاً، لأَنَّكَ أَنْتَ مَعِي. عَصَاكَ وَعُكَّازُكَ هُمَا يُعَزِّيَانِنِي.',
      },
      {
        verseNumber: 5,
        text: 'تُرَتِّبُ قُدَّامِي مَائِدَةً تُجَاهَ مُضَايِقِيَّ. مَسَحْتَ بِالدُّهْنِ رَأْسِي. كَأْسِي رَيَّا.',
      },
      {
        verseNumber: 6,
        text: 'إِنَّمَا خَيْرٌ وَرَحْمَةٌ يَتْبَعَانِنِي كُلَّ أَيَّامِ حَيَاتِي، وَأَسْكُنُ فِي بَيْتِ الرَّبِّ إِلَى مَدَى الأَيَّامِ.',
      },
    ],
  },
};

export function getChapterContent(
  bookId: string,
  chapterNumber: number,
  editionId: string = 'web',
): ChapterContent {
  const book = getBook(bookId);
  const edition = getEdition(editionId);
  const key = `${book.id}_${chapterNumber}`;

  // Check if we have verbatim pilot fixture text (supporting legacy short IDs and canonical full IDs)
  const shortId = edition.id
    .replace('eng-', '')
    .replace('tel-', '')
    .replace('ara-', '')
    .replace('hin-', '');
  const fixtureVerses =
    FIXTURES[key]?.[edition.id] ||
    FIXTURES[key]?.[shortId] ||
    FIXTURES[key]?.[edition.code.toLowerCase()] ||
    FIXTURES[key]?.['web'];

  const bookNames = book.names as Record<string, string>;

  if (fixtureVerses && fixtureVerses.length > 0) {
    return {
      bookId: book.id,
      bookName: bookNames[edition.language] || book.names.en,
      chapterNumber,
      editionId: edition.id,
      verses: fixtureVerses,
      totalVerses: fixtureVerses.length,
    };
  }

  // Fallback: Generate clearly marked preview verses
  const fallbackVersesCount = 16;
  const verses: VerseContent[] = [];

  for (let v = 1; v <= fallbackVersesCount; v++) {
    let sampleText = `[Pilot Study Preview] Verse ${v} of ${book.names.en} chapter ${chapterNumber}. Full verified scripture text is ingested by Codex under G-LIC-1 licensing pipeline.`;
    if (edition.language === 'te') {
      sampleText = `[పైలట్ పరిశీలన నమూనా] ${book.names.te} అధ్యాయం ${chapterNumber}, వచనం ${v}. అధికారిక లేఖన వచనములు కోడెక్స్ లైసెన్సింగ్ పైప్‌లైన్ ద్వారా చేర్చబడుతున్నాయి.`;
    } else if (edition.language === 'ar') {
      sampleText = `[معاينة تجريبية] الآية ${v} من ${book.names.ar} الأصحاح ${chapterNumber}. يتم استيراد النص المعتمد عبر منصة التراخيص الرسمية.`;
    }

    verses.push({
      verseNumber: v,
      text: sampleText,
      heading:
        v === 1
          ? `${bookNames[edition.language] || book.names.en} ${chapterNumber}`
          : undefined,
    });
  }

  return {
    bookId: book.id,
    bookName: bookNames[edition.language] || book.names.en,
    chapterNumber,
    editionId: edition.id,
    verses,
    totalVerses: verses.length,
  };
}
