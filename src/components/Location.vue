<template>
  <div class="location__container">
    <div class="location">
      <p>{{ locationName }}</p>
      <p>earns {{ minGoldEarn }} - {{ maxGoldEarn }} golds or</p>
      <p>loses 0 - {{ maxGoldLost }} golds</p>
      <div class="btn-container">
        <button
          @click="findGold"
          class="btn"
          :class="{ btn__findgold: !findDisabled, btn__disabled: findDisabled }"
          :disabled="findDisabled"
        >
          {{ findButtonMsg }}
        </button>
        <button
          @click="upgradeLocation"
          class="btn"
          :class="{
            btn__disabled: upgradeDisabled,
            btn__upgrade: !upgradeDisabled
          }"
          :disabled="upgradeDisabled"
        >
          Upgrade
        </button>
      </div>
    </div>
    <div :style="{ width: printUpdateBar }" class="gold-to-upgrade"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Location",
  data() {
    return {
      locationName: this.location.name,
      coolDown: this.location.cooldown,
      currCoolDown: 0,
      findButtonMsg: "Find Gold",
      myTimer: null
    };
  },
  props: ["location"],
  methods: {
    ...mapActions(["getGold"]),
    findGold() {
      // Reseteamos el contador y empezamos a correr ell timer.
      this.currCoolDown = this.coolDown;
      this.timer();
      // Envia al store los datos de la jugada actual
      this.getGold({
        minEarn: this.minGoldEarn,
        maxEarn: this.maxGoldEarn,
        maxLost: this.maxGoldLost,
        name: this.locationName
      });
    },
    upgradeLocation() {
      if (this.levels.indexOf(this.currentLevel) < 4) {
        this.locationLevels[this.locationName] = this.levels[
          this.levels.indexOf(this.currentLevel) + 1
        ];
      }
    },
    findGoldCount() {
      if (this.currCoolDown < 1) {
        this.findButtonMsg = "Find Gold";
        clearInterval(this.myTimer);
      } else {
        this.currCoolDown = this.currCoolDown - 1;
        this.findButtonMsg = this.currCoolDown;
      }
    },
    timer() {
      this.myTimer = setInterval(this.findGoldCount, 100);
    }
  },
  computed: {
    currentLevel() {
      return this.locationLevels[this.locationName];
    },
    minGoldEarn() {
      return this.location.goldEarn.min;
    },
    maxGoldEarn() {
      return this.location.goldEarn.max[this.currentLevel];
    },
    maxGoldLost() {
      return this.location.goldLost[this.currentLevel];
    },
    costUpgrade() {
      return this.location.costUpgrade[this.currentLevel];
    },
    printUpdateBar() {
      if (this.myGold >= this.costUpgrade) {
        // Si el oro es mas del necesario
        return "100%";
      } else if (this.myGold <= 0) {
        // Si el oro es menor que cero
        return "0";
      } else {
        // Si es oro es mayor que cero pero menor que lo necesario para subr de nivel
        return `${(this.myGold / this.costUpgrade) * 100}%`;
      }
    },
    upgradeDisabled() {
      // Si se puede seguir mejorando
      if (this.levels.indexOf(this.currentLevel) < 4) {
        return this.myGold < this.costUpgrade;
      }
      // En caso contrario deshabilita el boton
      return true;
    },
    findDisabled() {
      // Conjunto de condiciones para que el boton este deshabilitado.
      // Dinero suficiente y que no haya cooldown.
      const commonConditions =
        this.myGold < this.maxGoldLost || this.currCoolDown !== 0;
      // Para Casino, haber presionado en todas las otras locaciones.
      const casinoConditions =
        this.isPressed.Farm == false ||
        this.isPressed.House == false ||
        this.isPressed.Cave == false;
      if (this.locationName == "Casino") {
        return commonConditions || casinoConditions;
      } else {
        return commonConditions;
      }
    },
    ...mapState(["myGold", "locationLevels", "levels", "isPressed"])
  }
};
</script>

<style lang="scss" scoped>
// Reset estilos boton
button {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}
.location__container {
  border: 1px solid #000;
  width: 25%;
}
.location {
  padding: 2em 3em;
}
.btn-container {
  display: flex;
  flex-wrap: wrap;
}

.btn {
  padding: 0.5em 1em;
  color: #fff;
  flex-grow: 1;
  width: 100%;

  &__findgold {
    background-color: teal;
  }
  &__upgrade {
    background-color: maroon;
  }
  &__disabled {
    background-color: gray;
  }
}

.gold-to-upgrade {
  height: 10px;
  background-color: teal;
}
</style>
