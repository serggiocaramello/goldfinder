<template>
  <div id="app">
    <h1>Tu oro: {{ myGold }}</h1>
    <div class="locations__container">
      <Location
        v-for="location in locations"
        :key="location.id"
        :location="location"
      ></Location>
    </div>
    <h2>List of Activities:</h2>
    <div ref="activities" class="activities">
      <p
        v-for="activity in activities"
        :key="activity.id"
        :class="activity.currentClass"
      >
        <template v-if="activity.earnsGold">
          <!-- Mensaje cuando se gana oro. -->
          Earned {{ activity.gold }} gold from the {{ activity.location }}!
          {{ activity.time }}
        </template>
        <template v-else>
          <!-- Mensaje cuando se pierde oro. -->
          Lost {{ activity.gold }} gold from the {{ activity.location }} :(
          {{ activity.time }}
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import Location from "@/components/Location.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "App",
  data() {
    return {
      activities: []
    };
  },
  components: { Location },
  computed: {
    ...mapState(["myGold", "locations", "lastPlay"])
  },
  methods: {
    ...mapActions(["getLocations"])
  },
  watch: {
    // Para generar array activities con las jugadas historicas
    lastPlay: function() {
      this.activities.push({
        ...this.lastPlay,
        id: this.activities.length,
        currentClass: this.lastPlay.earnsGold ? "win" : "lose"
      });
    }
  },
  updated() {
    // Para que siempre se muestra la ultima jugada en el cuadro de activities.
    this.$refs.activities.scrollTop = this.$refs.activities.scrollHeight;
  },
  mounted() {
    this.getLocations();
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
.locations__container {
  display: flex;
  justify-content: space-between;
}
.activities {
  border: 1px solid #000;
  margin-top: 2em;
  padding: 0 3em;
  p {
    padding: 0.5em 1em;
    margin: 0.5em 0;
  }
  min-height: 1em;
  max-height: 30vh;
  overflow-y: auto;
}
.win {
  background-color: mediumaquamarine;
}
.lose {
  background-color: rgb(216, 133, 133);
}
</style>
