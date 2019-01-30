<template>
	<div>
	<div class="labeling" v-if="textsLabeled <=100">
		<div class="personal-info">
			Имя: <span class="name">{{name}}</span>. <span v-if="textsLabeled">Закодировано текстов: {{textsLabeled}}/100</span>. Этноним: «<mark>{{data.eth_raw}}</mark>». Глагол: «<mark class="verb">{{data.raw_verb}}</mark>».
		</div>
		<hr>
	<div class="columns">
		<div class="column">
			<div class="text" v-html="data.source_text">
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === 'isClear'">
		<div class="column isClear">
			<div class="has-text-centered title">Понятно ли Вам о чем текст?</div>
			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="isClear = 'Да'">Да</div>
				<div class="button is-large" @click="isClear = 'Нет'">Нет</div>
			</div>
 		</div>
	</div>
	<div class="columns" v-if="currentStep === 'isVerb'">
		<div class="column isVerb">
			<div class="has-text-centered title">Является ли слово «<mark class="verb">{{data.raw_verb}}</mark>» глаголом?</div>

			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="isVerb = 'Да'">Да</div>
				<div class="button is-large" @click="isVerb = 'Нет'">Нет</div>
				<div class="button is-large" @click="isVerb = 'Не понятно'">Не понятно</div>
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === 'isEthnonym'">
		<div class="column isEthnonym">
			<span class="has-text-centered title">Является ли слово «<mark>{{data.eth_raw}}</mark>» этнонимом-существительным либо этническим прилагательным в составе словосочетания, обозначающего этническую группу или этнического персонажа, индивидуального или коллективного?
			</span>
			<abbr title="Положительные примеры: японец, русские, таджикская девочка, чеченский тейп, казахский народ).\n В данном проекте к этнонимам также относятся все этнофолизмы (жиды, хачи, чурки, укропы, русня, нерусь) и некоторые нации и регионализмы, употребляемые как этнонимы (американцы, кавказцы, азиаты, европейцы, южане).
Отрицательные примеры: «кавказцы и спаниели», «чурки и поленья», «Анрэ Жид», «ресторан «Япоша»», агентство «ЧеченИнформ»»; неправильная лемматизация «Туве Янссон – тува».">
			Пояснение
		</abbr>

			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="isEthnonym = 'Да'">Да</div>
				<div class="button is-large" @click="isEthnonym = 'Нет'">Нет</div>
				<div class="button is-large" @click="isEthnonym = 'Не понятно'">Не понятно</div>
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === 'isRelated'">
		<div class="column isRelated">
			<div class="has-text-centered title">Связаны ли слова «<mark>{{data.raw_verb}}</mark>» и «<mark class="verb">{{data.eth_raw}}</mark>» синтаксической/смысловой связью?</div>
			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="isRelated = 'Субъект'">Да</div>
				<div class="button is-large" @click="isRelated = 'Объект'">Нет</div>
				<div class="button is-large" @click="isRelated = 'Нет'">Нет связи</div>
				<div class="button is-large" @click="isRelated = 'Не понятно'">Не понятно</div>
			</div>
		</div>
	</div>
	<div class="columns">
		<div class="column verbNeg" v-if="currentStep === 'verbNeg'">
			<div class="has-text-centered title">Насколько с помощью глагола «<mark>{{data.raw_verb}}</mark>» выражено негативное (либо позитивное) отношение к этнической группе / этническому персонажу</div>
			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="setVerbNeg(1)">-3</div>
				<div class="button is-large" @click="setVerbNeg(2)">-2</div>
				<div class="button is-large" @click="setVerbNeg(3)">-1</div>
				<div class="button is-large" @click="setVerbNeg(4)">0</div>
				<div class="button is-large" @click="setVerbNeg(5)">1</div>
				<div class="button is-large" @click="setVerbNeg(6)">2</div>
				<div class="button is-large" @click="setVerbNeg(7)">3</div>
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === 'verbNegContext'">
		<div class="column verbNegContext">
			<div class="has-text-centered title">Может ли глагол «<mark class="verb">{{data.raw_verb}}</mark>» в другом контексте выражать негативное отношение к этнической группе?</div>
			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="verbNegContext = 'Да'">Да</div>
				<div class="button is-large" @click="verbNegContext = 'Нет'">Нет</div>
				<div class="button is-large" @click="verbNegContext = 'Не понятно'">Не понятно</div>
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === 'context'">
		<div class="column context">
			<div class="has-text-centered title">Постарайтесь, пожалуйста, своими словами указать контекст употребления исследуемых слов.</div>
			<div class="columns">
				<div class="column box" @click="context = 'S'">
					S – subject (если в тексте глагол связан с этнической группой с помощью связи О)
				</div>
				<div class="column box" @click="context = 'O1'">
					О1 – object + глагол в 1 лице. Например: «Чеченцы ненавидят русских» может не выражать отрицательного отношения к русским, так как чеченцы могут осуждаться. Но «я ненавижу русских» однозначно выражает негативное отношение к русским. 
				</div>
				<div class="column box" @click="context = 'ОI'">ОI  - object  + глагол в императиве или сходных по смыслу формах.  Например, «Депортировали не только чеченцев и не только во время войны» может не выражать негативного отношения к чеченцам, так как депортация может осуждаться. Однако негативное отношение к чеченцами выражают призывы к депортации: «Депортируйте уже всех чеченцев», «Надо снова депортировать чеченцев», «Давайте депортируем…», «Как хочется депортировать...» и т.д.</div>

				<div class="column">
					<div class="field">
						<label for="" class="label">Свой вариант</label>
						<textarea class="textarea" placeholder="Свой вариант" v-model="ownContext"></textarea>
					</div>
					<br>
				<button class="button is-primary" @click="context = ownContext">
					Отправить свой вариант
                </button>
				</div>
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === 'textNeg'">
		<div class="column textNeg">
			<div class="has-text-centered title">Выражено ли в тексте отрицательное (или положительное) отношение к исследуемой этнической группе / персонажу с помощью других средств (не кодируемого глагола)?</div>

			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="setTextNeg(1)">-3</div>
				<div class="button is-large" @click="setTextNeg(2)">-2</div>
				<div class="button is-large" @click="setTextNeg(3)">-1</div>
				<div class="button is-large" @click="setTextNeg(4)">0</div>
				<div class="button is-large" @click="setTextNeg(5)">1</div>
				<div class="button is-large" @click="setTextNeg(6)">2</div>
				<div class="button is-large" @click="setTextNeg(7)">3</div>
			</div>
		</div>
	</div>

	</div>
	<div v-else>
		<h1 class="title is-1">
			Вы разметили все тексты. Отличная работа!
		</h1>
	</div>
	</div>
</template>

<style>
	.labeling {
		margin-top: 50px;
	}
	mark.verb {
		background-color: #5f5;
	}

	.text {
		font-size: 1.1rem;
	}

	.context .column {
		cursor: pointer;
		margin: 10px;
	}

	.personal-info {
		margin: 20px 0;
	}
</style>

<script>
// @ is an alias to /src
import axios from 'axios';


const path = ["isClear", "isVerb", "isEthnonym", "isRelated", "verbNeg", "verbNegContext", "context", "textNeg"];

export default {
	name: 'labeling',
	data () {
		return {
			data: {},
			name: '',
			textsLabeled: 0,
			isClear: "",
			isVerb: "",
			isEthnonym: "",
			isRelated: "",
			verbNeg: "",
			verbNegContext: "",
			textNeg: "",
			context: "",
			ownContext: "",
			currentStep: "isClear",
			branch: new Set(),
		}
	},
	mounted () {
		this.getText();
	},
	methods: {
		setTextNeg (score) {
			this.textNeg = score;
		},
		setVerbNeg (score) {
			this.verbNeg = score;
		},
		startLabeling () {
			localStorage.setItem('coder', this.name);
			this.$router.push({ path: 'labeling' });
		},
		getText() {
			console.log("getText");
			const name = localStorage.getItem('name');
			this.name = name;
			axios
				.get('https://ihun.pythonanywhere.com/api/text', {params: {name: name}})
				.then(response => {
					this.textsLabeled = response.data.textsLabeled
					this.data = response.data.texts;

					this.data.source_text = this.data.source_text.replace(this.data.eth_raw, `<mark>${this.data.eth_raw}</mark>`);
					this.data.source_text = this.data.source_text.replace(this.data.raw_verb, `<mark class="verb">${this.data.raw_verb}</mark>`);
				})
			this.branch = new Set(path);
			console.log("getText branch", this.branch.values().next().value, path)
			this.currentStep = this.branch.values().next().value;
		},
		postText () {
			const toServerData = {
				name: this.name,
				textId: this.data.document_id,
				eth: this.data.eth_raw,
				raw_verb: this.data.raw_verb,
				isClear: this.isClear,
				isVerb: this.isVerb,
				isEthnonym: this.isEthnonym,
				isRelated: this.isRelated,
				verbNeg: this.verbNeg,
				verbNegContext: this.verbNegContext,
				textNeg: this.textNeg,
				context: this.context
			}

			console.log("Отправляются на сервер", toServerData);

			axios.post('https://ihun.pythonanywhere.com/api/label', toServerData)

			this.branch = new Set();
			this.data = {};
			this.isClear = "";
			this.isVerb = "";
			this.isEthnonym = "";
			this.isRelated = "";
			this.verbNeg = "";
			this.verbNegContext = "";
			this.textNeg = "";
			this.context = "";
		},
	},
	watch: {
		isClear: function(val, oldVal) {
			console.warn("isClear", this.currentStep, this.branch, val);
			if (val) {
				this.branch.delete("isClear");
				this.currentStep = this.branch.values().next().value;
			}
		},
		isVerb: function(val, oldVal) {
			console.warn("isVerb", this.currentStep, this.branch, val);

			if (this.isClear === "Нет" && (val === "Нет" || val === "Не понятно")) {
				console.log("Если текст непонятен и Verb? = N or U, прекратить кодирование");
				this.branch = new Set();
				this.currentStep = this.branch.values().next().value;
			}

			if (this.isClear === "Нет" && (val === "Да")) {
				console.log("Если текст не понятен, но Verb&=Y, далее заполнить только поля verbNegContext, context.");
				this.branch = new Set(["verbNegContext", "context"]);
				this.currentStep = this.branch.values().next().value;
			}

			if (this.isClear === "Да" && (val === "Нет" || val === "Не понятно")) {
				console.log("Если текст понятен, но Verb&= N or U заполнить только поля isEthnonym, textNeg")
				this.branch = new Set(["isEthnonym", "textNeg"]);
				this.currentStep = this.branch.values().next().value;
			}
			if (this.isClear === "Да" && (val === "Да")) {
				console.log("Текст и глагол понятны");
				this.branch.delete("isVerb");
				this.currentStep = this.branch.values().next().value;
			}

		},
		isEthnonym: function(val, oldVal) {
			console.warn("isEthnonym", this.currentStep, this.branch, val);
			if (this.branch.has("isEthnonym")) {
				if (val === "Да") {
					console.log("Слово — этноним, идём дальше");
					this.branch.delete("isEthnonym");
					this.currentStep = this.branch.values().next().value;
				}

				if (val === "Нет" || val === "Не понятно") {
					console.log("Если Ethn?=N or U, далее заполнить только поля verbNegContext, context");
					this.branch = new Set(["verbNegContext", "context"]);
					this.currentStep = this.branch.values().next().value;
				}
			}

			this.branch.delete("isEthnonym");
		},
		isRelated: function(val, oldVal) {
			console.warn("isRelated", this.currentStep, this.branch, val);
			if (val) {
				if ((val === "Нет") || (val === "Не понятно")) {
					console.log("Если Related?=N or U, далее заполнить только поля verbNegContext? , context и textNeg?");
					this.branch = new Set(["verbNegContext", "context", "textNeg"]);
				}
				this.branch.delete("isRelated");
				this.currentStep = this.branch.values().next().value;
			}
		},
		verbNeg: function(val, oldVal) {
			console.warn("verbNeg", this.currentStep, this.branch, val);
			if (val) {
				this.branch.delete("verbNeg");
				this.currentStep = this.branch.values().next().value;
			}
		},
		verbNegContext: function(val, oldVal) {
			console.warn("verbNegContext", this.currentStep, this.branch, val);
			if (val) {
				this.branch.delete("verbNegContext");
				this.currentStep = this.branch.values().next().value;
			}
		},
		context: function(val, oldVal) {
			console.warn("context", this.currentStep, this.branch, val);
			if (val) {
				this.branch.delete("context");
				this.currentStep = this.branch.values().next().value;
			}
		},
		textNeg: function(val, oldVal) {
			console.warn("textNeg", this.currentStep, this.branch, val, this.branch.size);
			if (val) {
				console.log("textNeg val", val)
				this.branch.delete("textNeg");
				this.currentStep = this.branch.values().next().value;
			}
		},
		branch: function(val, oldVal) {
			console.log("branch", val, oldVal, val.size);
			if (val.size === 0) {
				console.log("Кодирование закончено branch")
			}
		},
		currentStep: function(val, oldVal) {
			console.log("currentStep", val, oldVal);
			if (val === undefined) {
				console.log("Кодирование закончено currentStep");
				this.postText();
				this.getText();
			}
		},
	}
};
</script>
