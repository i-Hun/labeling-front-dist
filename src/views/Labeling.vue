<template>
	<div>
	<div class="labeling" v-if="data">
		<div class="personal-info">
			Имя: <span class="name">{{name}}</span>. <span>Закодировано текстов: {{textsLabeled}}.</span> Этноним: «<mark>{{data.eth_raw}}</mark>». Глагол: «<mark class="verb">{{data.raw_verb}}</mark>». ID текста: {{data.document_id}}.
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
				<div class="button is-large" @click="isRelated = 'S'">Да, этническая группа — субъект</div>
				<div class="button is-large" @click="isRelated = 'O'">Да, этническая группа — объект</div>
				<div class="button is-large" @click="isRelated = 'Нет'">Нет</div>
				<div class="button is-large" @click="isRelated = 'Не понятно'">Не понятно</div>
			</div>
		</div>
	</div>
	<div class="columns">
		<div class="column verbNeg" v-if="currentStep === 'verbNeg'">
			<div class="has-text-centered title">Оцените по пятибалльной шкале отношение автора к этнической группе / этническому персонажу, выраженное с помощью глагола «<mark>{{data.raw_verb}}</mark>» (-2 — сильно негативное, 2 — сильно позитивное).</div>
			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="setVerbNeg(1)">-2</div>
				<div class="button is-large" @click="setVerbNeg(2)">-1</div>
				<div class="button is-large" @click="setVerbNeg(3)">0</div>
				<div class="button is-large" @click="setVerbNeg(4)">1</div>
				<div class="button is-large" @click="setVerbNeg(5)">2</div>
			</div>
			<textarea class="textarea" placeholder="Окно для ввода словосочетания на случай, если глагол выражает отношение к этнониму, будучи в составе словосочетания" v-model="verbNegOwn"></textarea>

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
			<div class="has-text-centered title">Укажите, в каком контексте глагол «<mark class="verb">{{data.raw_verb}}</mark>» может выражать негативное отношение к этническому персонажу / этнической группе.</div>
			<div class="columns">
				<div class="column box" @click="context = 'S'">
					S — этноним-субъект («понаехали азиаты всякие»).
				</div>
				<div class="column box" @click="context = 'O1'">
					О1 – глагол в 1 лице + этноним-объект («ненавижу русских»).
				</div>
				<div class="column box" @click="context = 'ОI'">ОI - глагол в императиве или сходных по смыслу формах + этноним-объект («надо снова депортировать чеченцев»)</div>

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
			<div class="has-text-centered title">Оцените по пятибалльной шкале отношение автора к этнической группе / этническому персонажу, выраженное с помощью других средств (не кодируемого глагола), если оно есть? (-2 — сильно негативное, 2 — сильно позитивное)</div>

			<div class="buttons are-large is-centered has-addons">
				<div class="button is-large" @click="setTextNeg(1)">-2</div>
				<div class="button is-large" @click="setTextNeg(2)">-1</div>
				<div class="button is-large" @click="setTextNeg(3)">0</div>
				<div class="button is-large" @click="setTextNeg(4)">1</div>
				<div class="button is-large" @click="setTextNeg(5)">2</div>
			</div>
		</div>
	</div>
	<div class="columns" v-if="currentStep === undefined">
		<div class="column final">
			<div class="has-text-centered title">Текст размечен</div>
			<p>Ваши ответы:</p>
			<ul>
				<li v-if="isClear">
					Понятен ли текст? <strong>{{isClear}}</strong>
				</li>
				<li v-if="isVerb">Является ли слово «<mark class="verb">{{data.raw_verb}}</mark>» глаголом? <strong>{{isVerb}}</strong>
				</li>
				<li v-if="isEthnonym">
					Является ли слово «<mark>{{data.eth_raw}}</mark>» этнонимом? <strong>{{isEthnonym}}</strong>
				</li>
				<li v-if="isRelated">
					Связаны ли слова «<mark>{{data.raw_verb}}</mark>» и «<mark class="verb">{{data.eth_raw}}</mark>» синтаксической/смысловой связью? <strong>{{isRelated}}</strong>
				</li>
				<li v-if="verbNeg">
					Насколько с помощью глагола «<mark>{{data.raw_verb}}</mark>» выражено негативное (либо позитивное) отношение к этнической группе / этническому персонажу? <strong>{{verbNeg - 3}}</strong>
				</li>
				<li v-if="verbNegContext">
					Может ли глагол «<mark class="verb">{{data.raw_verb}}</mark>» в другом контексте выражать негативное отношение к этнической группе? <strong>{{verbNegContext}}</strong>
				</li>
				<li v-if="context">
					Постарайтесь, пожалуйста, своими словами указать контекст употребления исследуемых слов. <strong>{{context}}</strong>
				</li>
				<li v-if="textNeg">
					Выражено ли в тексте отрицательное (или положительное) отношение к исследуемой этнической группе / персонажу с помощью других средств (не кодируемого глагола)? <strong>{{textNeg - 3}}</strong>
				</li>
			</ul>
			<div class="buttons has-addons is-centered are-large">
				<div class="button is-large" @click="resetSteps()">Ответить заново</div>
				<div class="button is-large" @click="sendData()">Отправить данные</div>
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

const domain = "https://ihun.pythonanywhere.com";
// const domain = "http://localhost:8080";
const path = ["isClear", "isVerb", "isEthnonym", "isRelated", "verbNeg", "verbNegContext", "context", "textNeg"];

export default {
	name: 'labeling',
	data () {
		return {
			data: {},
			name: '',
			textsLabeled: 0,
			// textsRemained: 0,
			isClear: "",
			isVerb: "",
			isEthnonym: "",
			isRelated: "",
			verbNeg: "",
			verbNegContext: "",
			textNeg: "",
			context: "",
			ownContext: "",
			verbNegOwn: "",
			currentStep: "isClear",
			branch: new Set(),
			passedPath: [],
			timer: new Date()
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
				.get(domain + '/api/text', {params: {name: name}})
				.then(response => {
					this.textsLabeled = response.data.textsLabeled;
					// this.textsRemained = response.data.textsRemained;
					this.data = response.data.texts;

					this.data.source_text = this.data.source_text.replace(this.data.eth_raw, `<mark>${this.data.eth_raw}</mark>`);
					this.data.source_text = this.data.source_text.replace(this.data.raw_verb, `<mark class="verb">${this.data.raw_verb}</mark>`);
				})
			this.branch = new Set(path);
			console.log("getText branch", this.branch.values().next().value, path)
			this.currentStep = this.branch.values().next().value;
			this.timer = new Date();
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
				context: this.context,
				verbNegOwn: this.verbNegOwn,
				timer: new Date() - this.timer
			}

			if (!toServerData.textId) {
				alert("Не указан ID текста");
				throw "Не указан ID текста";
			}
			if (!toServerData.name) {
				alert("Не указано имя");
				throw "Не указано имя";
			}

			console.log("Отправляются на сервер", toServerData);

			axios.post(domain + '/api/label', toServerData)
				.then(response => {
					console.log("post", response.data)
					this.textsLabeled = response.data.textsLabeled;
					this.getText();
				});

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
			this.ownContext = "";
			this.verbNegOwn = "";
		},
		sendData() {
			this.postText();
		},
		resetSteps () {
			this.isClear = "";
			this.isVerb = "";
			this.isEthnonym = "";
			this.isRelated = "";
			this.verbNeg = "";
			this.verbNegContext = "";
			this.textNeg = "";
			this.context = "";
			this.ownContext = "";
			this.verbNegOwn = "";
			this.branch = new Set(path);
			this.currentStep = this.branch.values().next().value;
		}
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
			if ((this.isClear === "Да") && (this.isVerb === "Нет" || this.isVerb === "Не понятно")) {
				if (val === "Да") {
					console.log("Слово — этноним, идём дальше");
					this.branch = new Set(["textNeg"]);
					this.currentStep = this.branch.values().next().value;
					this.branch.delete("isEthnonym");
				} 
				if (val === "Нет" || val === "Не понятно") {
					this.branch = new Set([]);
					this.currentStep = this.branch.values().next().value;
					this.branch.delete("isEthnonym");
				}
			} else {
				if (val === "Да") {
					console.log("Слово — этноним, идём дальше");
					this.branch.delete("isEthnonym");
					this.currentStep = this.branch.values().next().value;
					this.branch.delete("isEthnonym");
				}

				if (val === "Нет" || val === "Не понятно") {
					console.log("Если Ethn?=N or U, далее заполнить только поля verbNegContext, context");
					this.branch = new Set(["verbNegContext", "context"]);
					this.currentStep = this.branch.values().next().value;
					this.branch.delete("isEthnonym");
				}
			}
		},
		isRelated: function(val, oldVal) {
			console.warn("isRelated", this.currentStep, this.branch, val);
			if (this.isVerb === "Да" && this.isEthnonym === "Да" && (val === "Нет" || val === "Не понятно")) {
				this.branch = new Set(["verbNegContext", "textNeg"]);
				this.currentStep = this.branch.values().next().value;
			} else {
				if (val) {
					if ((val === "Нет") || (val === "Не понятно")) {
						console.log("Если Related?=N or U, далее заполнить только поля verbNegContext , context и textNeg");
						this.branch = new Set(["verbNegContext", "context", "textNeg"]);
					}
					this.branch.delete("isRelated");
					this.currentStep = this.branch.values().next().value;
				}
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
			if (this.isClear === "Да" && this.isVerb === "Да" && this.isEthnonym === "Да" && (this.isRelated === "Нет" || this.isRelated === "Не понятно") && 
				val === "Да") {
				console.log("!!!")
				this.branch = new Set(["context", "textNeg"]);
				this.currentStep = this.branch.values().next().value;
			} 

			if (this.isClear === "Да" && this.isVerb === "Да" && this.isEthnonym === "Да" && (this.isRelated === "S" || this.isRelated === "O") && 
				(val === "Нет" || val === "Не понятно")) {
				this.branch = new Set(["textNeg"]);
				this.currentStep = this.branch.values().next().value;
			} 
			if (this.isClear === "Нет" && this.isVerb === "Да") {
				console.log("!")
				if  (val === "Нет" || val === "Не понятно") {
					console.log("!!")
					this.branch = new Set([]);
					this.currentStep = this.branch.values().next().value;
				}

				if  (val === "Да") {
					console.log("!!!")
					this.branch = new Set(["context"]);
					this.currentStep = this.branch.values().next().value;
				}


			}
			if (this.isVerb === "Да" && (this.isEthnonym === "Нет" || this.isEthnonym === "Не понятно") 
				&& (this.verbNegContext === "Нет" || this.verbNegContext === "Не понятно")) {
				this.branch = new Set(["textNeg"]);
				this.currentStep = this.branch.values().next().value;
			} else {
				if ((this.isClear === "Нет" && (this.isVerb === "Да"))) {
					if  (val === "Нет" || val === "Не понятно") {
						this.branch = new Set([]);
						this.currentStep = this.branch.values().next().value;
					}

				} else {
					if (val) {
						this.branch.delete("verbNegContext");
						this.currentStep = this.branch.values().next().value;
					}
				}
			}

		},
		context: function(val, oldVal) {
			console.warn("context", this.currentStep, this.branch, val);
			if (this.isVerb === "Да" && (this.isEthnonym === "Нет" || this.isEthnonym === "Не понятно") && (this.verbNegContext === "Да")) {
					this.branch = new Set(["textNeg"]);
					this.currentStep = this.branch.values().next().value;	
			} else {
				if (val) {
					this.branch.delete("context");
					this.currentStep = this.branch.values().next().value;
				}
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
			}
		},
	}
};
</script>
